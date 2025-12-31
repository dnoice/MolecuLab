/**
 * ============================================================================
 * Molecular File Parsers
 * Parse MOL, PDB, XYZ, and SDF file formats into molecule data
 * ============================================================================
 */
import type { Atom, Bond, Molecule } from '../viewer';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type FileFormat = 'mol' | 'pdb' | 'xyz' | 'sdf' | 'unknown';

export interface ParseResult {
  success: boolean;
  molecule?: Molecule;
  error?: string;
  format: FileFormat;
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_COLORS: Record<string, string> = {
  H: '#ffffff',
  C: '#00ffcc',
  N: '#3366ff',
  O: '#ff3366',
  S: '#ffd700',
  P: '#ff8800',
  F: '#90e050',
  Cl: '#1ff01f',
  Br: '#a62929',
  I: '#940094',
  Na: '#ff8800',
  K: '#ff8800',
  Ca: '#ffd700',
  Mg: '#ffd700',
  Fe: '#3366ff',
  Zn: '#9933ff',
  Cu: '#ff8800',
};

const ELEMENT_RADII: Record<string, number> = {
  H: 1.2,
  C: 1.7,
  N: 1.55,
  O: 1.52,
  S: 1.8,
  P: 1.8,
  F: 1.47,
  Cl: 1.75,
  Br: 1.85,
  I: 1.98,
  Na: 2.27,
  K: 2.75,
  Ca: 2.31,
  Mg: 1.73,
  Fe: 1.94,
  Zn: 1.39,
  Cu: 1.4,
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT DETECTION
// ═══════════════════════════════════════════════════════════════════════════

export function detectFormat(content: string, filename?: string): FileFormat {
  // Check by file extension first
  if (filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'mol' || ext === 'mol2') return 'mol';
    if (ext === 'pdb') return 'pdb';
    if (ext === 'xyz') return 'xyz';
    if (ext === 'sdf') return 'sdf';
  }

  // Detect by content
  const lines = content.trim().split('\n');

  // PDB format - starts with HEADER, ATOM, or HETATM
  if (lines.some(l => /^(HEADER|ATOM|HETATM|CRYST1)/.test(l))) {
    return 'pdb';
  }

  // XYZ format - first line is atom count (integer)
  if (/^\s*\d+\s*$/.test(lines[0])) {
    return 'xyz';
  }

  // MOL/SDF format - has counts line with format "aaabbblllfffcccsssxxxrrrpppiiimmmvvvvvv"
  // Typically line 4 has atom/bond counts
  if (lines.length > 3) {
    const countsLine = lines[3];
    if (/^\s*\d+\s+\d+/.test(countsLine)) {
      if (content.includes('$$$$')) return 'sdf';
      return 'mol';
    }
  }

  return 'unknown';
}

// ═══════════════════════════════════════════════════════════════════════════
// XYZ PARSER
// ═══════════════════════════════════════════════════════════════════════════

export function parseXYZ(content: string, name?: string): ParseResult {
  try {
    const lines = content.trim().split('\n');

    if (lines.length < 3) {
      return { success: false, error: 'Invalid XYZ file: too few lines', format: 'xyz' };
    }

    const atomCount = parseInt(lines[0].trim(), 10);
    if (isNaN(atomCount)) {
      return { success: false, error: 'Invalid XYZ file: first line must be atom count', format: 'xyz' };
    }

    const comment = lines[1].trim();
    const atoms: Atom[] = [];

    for (let i = 2; i < 2 + atomCount && i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      if (parts.length < 4) continue;

      const element = parts[0];
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);

      if (isNaN(x) || isNaN(y) || isNaN(z)) continue;

      atoms.push({
        id: `${element}${i - 1}`,
        element,
        position: { x, y, z },
        color: ELEMENT_COLORS[element] || '#888888',
        radius: ELEMENT_RADII[element] || 1.5,
      });
    }

    // Auto-generate bonds based on distance
    const bonds = generateBondsFromDistance(atoms);

    const molecule: Molecule = {
      id: `xyz-${Date.now()}`,
      name: name || comment || 'Imported Molecule',
      atoms,
      bonds,
    };

    return { success: true, molecule, format: 'xyz' };
  } catch (err) {
    return { success: false, error: `Failed to parse XYZ: ${err}`, format: 'xyz' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MOL PARSER (V2000)
// ═══════════════════════════════════════════════════════════════════════════

export function parseMOL(content: string, name?: string): ParseResult {
  try {
    const lines = content.trim().split('\n');

    if (lines.length < 5) {
      return { success: false, error: 'Invalid MOL file: too few lines', format: 'mol' };
    }

    // Line 1: Molecule name
    const molName = lines[0].trim() || name || 'Imported Molecule';

    // Line 4: Counts line
    const countsLine = lines[3].trim();
    const countsParts = countsLine.split(/\s+/);
    const atomCount = parseInt(countsParts[0], 10);
    const bondCount = parseInt(countsParts[1], 10);

    if (isNaN(atomCount) || isNaN(bondCount)) {
      return { success: false, error: 'Invalid MOL file: cannot parse counts line', format: 'mol' };
    }

    // Parse atoms (lines 5 to 5+atomCount)
    const atoms: Atom[] = [];
    for (let i = 4; i < 4 + atomCount && i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      if (parts.length < 4) continue;

      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      const z = parseFloat(parts[2]);
      const element = parts[3];

      if (isNaN(x) || isNaN(y) || isNaN(z)) continue;

      atoms.push({
        id: `${element}${i - 3}`,
        element,
        position: { x, y, z },
        color: ELEMENT_COLORS[element] || '#888888',
        radius: ELEMENT_RADII[element] || 1.5,
      });
    }

    // Parse bonds (lines after atoms)
    const bonds: Bond[] = [];
    const bondStart = 4 + atomCount;
    for (let i = bondStart; i < bondStart + bondCount && i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      if (parts.length < 3) continue;

      const atom1Idx = parseInt(parts[0], 10) - 1;
      const atom2Idx = parseInt(parts[1], 10) - 1;
      const order = parseInt(parts[2], 10) as 1 | 2 | 3;

      if (atom1Idx >= 0 && atom1Idx < atoms.length && atom2Idx >= 0 && atom2Idx < atoms.length) {
        bonds.push({
          id: `b${i - bondStart + 1}`,
          atom1Id: atoms[atom1Idx].id,
          atom2Id: atoms[atom2Idx].id,
          order: order || 1,
        });
      }
    }

    const molecule: Molecule = {
      id: `mol-${Date.now()}`,
      name: molName,
      atoms,
      bonds,
    };

    return { success: true, molecule, format: 'mol' };
  } catch (err) {
    return { success: false, error: `Failed to parse MOL: ${err}`, format: 'mol' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PDB PARSER
// ═══════════════════════════════════════════════════════════════════════════

export function parsePDB(content: string, name?: string): ParseResult {
  try {
    const lines = content.trim().split('\n');
    const atoms: Atom[] = [];
    let molName = name || 'PDB Structure';

    // Extract name from HEADER or COMPND
    for (const line of lines) {
      if (line.startsWith('HEADER')) {
        molName = line.substring(10, 50).trim() || molName;
        break;
      }
      if (line.startsWith('COMPND') && line.includes('MOLECULE:')) {
        molName = line.split('MOLECULE:')[1]?.trim().replace(';', '') || molName;
        break;
      }
    }

    // Parse ATOM and HETATM records
    for (const line of lines) {
      if (!line.startsWith('ATOM') && !line.startsWith('HETATM')) continue;

      // PDB fixed-width format
      const serial = parseInt(line.substring(6, 11).trim(), 10);
      const atomName = line.substring(12, 16).trim();
      const x = parseFloat(line.substring(30, 38).trim());
      const y = parseFloat(line.substring(38, 46).trim());
      const z = parseFloat(line.substring(46, 54).trim());

      // Element is in columns 77-78, or derive from atom name
      let element = line.substring(76, 78).trim();
      if (!element) {
        element = atomName.replace(/\d/g, '').charAt(0);
      }

      if (isNaN(x) || isNaN(y) || isNaN(z)) continue;

      atoms.push({
        id: `${element}${serial}`,
        element,
        position: { x, y, z },
        color: ELEMENT_COLORS[element] || '#888888',
        radius: ELEMENT_RADII[element] || 1.5,
      });
    }

    // Generate bonds from CONECT records or distance
    const bonds = parsePDBBonds(content, atoms) || generateBondsFromDistance(atoms);

    const molecule: Molecule = {
      id: `pdb-${Date.now()}`,
      name: molName,
      atoms,
      bonds,
    };

    return { success: true, molecule, format: 'pdb' };
  } catch (err) {
    return { success: false, error: `Failed to parse PDB: ${err}`, format: 'pdb' };
  }
}

function parsePDBBonds(content: string, atoms: Atom[]): Bond[] | null {
  const lines = content.split('\n').filter(l => l.startsWith('CONECT'));
  if (lines.length === 0) return null;

  const bonds: Bond[] = [];
  const bondSet = new Set<string>();

  for (const line of lines) {
    const parts = line.substring(6).trim().split(/\s+/).map(n => parseInt(n, 10));
    const sourceIdx = parts[0] - 1;

    for (let i = 1; i < parts.length; i++) {
      const targetIdx = parts[i] - 1;
      if (sourceIdx < 0 || sourceIdx >= atoms.length || targetIdx < 0 || targetIdx >= atoms.length) continue;

      // Avoid duplicates
      const key = [Math.min(sourceIdx, targetIdx), Math.max(sourceIdx, targetIdx)].join('-');
      if (bondSet.has(key)) continue;
      bondSet.add(key);

      bonds.push({
        id: `b${bonds.length + 1}`,
        atom1Id: atoms[sourceIdx].id,
        atom2Id: atoms[targetIdx].id,
        order: 1,
      });
    }
  }

  return bonds.length > 0 ? bonds : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SDF PARSER (uses MOL parser for first molecule)
// ═══════════════════════════════════════════════════════════════════════════

export function parseSDF(content: string, name?: string): ParseResult {
  // SDF can contain multiple molecules; parse just the first one
  const molBlocks = content.split('$$$$');
  if (molBlocks.length === 0 || !molBlocks[0].trim()) {
    return { success: false, error: 'Invalid SDF file: no molecule data', format: 'sdf' };
  }

  const result = parseMOL(molBlocks[0], name);
  return { ...result, format: 'sdf' };
}

// ═══════════════════════════════════════════════════════════════════════════
// BOND GENERATION (for formats without explicit bonds)
// ═══════════════════════════════════════════════════════════════════════════

const BOND_DISTANCES: Record<string, number> = {
  'H-H': 0.74,
  'C-C': 1.54,
  'C-H': 1.09,
  'C-N': 1.47,
  'C-O': 1.43,
  'N-H': 1.01,
  'O-H': 0.96,
  'N-N': 1.45,
  'O-O': 1.48,
  'C-S': 1.82,
  'C-Cl': 1.77,
  'C-F': 1.35,
  'C-Br': 1.94,
  DEFAULT: 1.6,
};

function getBondDistance(el1: string, el2: string): number {
  const key1 = `${el1}-${el2}`;
  const key2 = `${el2}-${el1}`;
  return BOND_DISTANCES[key1] || BOND_DISTANCES[key2] || BOND_DISTANCES.DEFAULT;
}

function generateBondsFromDistance(atoms: Atom[]): Bond[] {
  const bonds: Bond[] = [];
  const tolerance = 0.4; // Angstroms

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a1 = atoms[i];
      const a2 = atoms[j];

      const dx = a1.position.x - a2.position.x;
      const dy = a1.position.y - a2.position.y;
      const dz = a1.position.z - a2.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const expectedDist = getBondDistance(a1.element, a2.element);

      if (dist <= expectedDist + tolerance) {
        bonds.push({
          id: `b${bonds.length + 1}`,
          atom1Id: a1.id,
          atom2Id: a2.id,
          order: 1,
        });
      }
    }
  }

  return bonds;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PARSE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

export function parseFile(content: string, filename?: string): ParseResult {
  const format = detectFormat(content, filename);

  switch (format) {
    case 'xyz':
      return parseXYZ(content, filename);
    case 'mol':
      return parseMOL(content, filename);
    case 'pdb':
      return parsePDB(content, filename);
    case 'sdf':
      return parseSDF(content, filename);
    default:
      return { success: false, error: 'Unknown file format', format: 'unknown' };
  }
}
