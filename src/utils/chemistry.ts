/**
 * ============================================================================
 * MolecuLab Chemistry Utilities
 * Helper functions for chemical calculations and transformations
 * ============================================================================
 */
import type { Atom, Bond, Molecule } from '@/types/molecule';
import elementsData from '@/data/elements.json';
import {
  HARTREE_TO_EV,
  HARTREE_TO_KJ,
  ANGSTROM_TO_BOHR,
} from './constants';

// Type for elements data
type ElementsMap = Record<string, {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  cpkColor: string;
  covalentRadius: number;
  vanDerWaalsRadius: number;
}>;

const elements = elementsData as ElementsMap;

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT LOOKUPS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get element data by symbol
 */
export function getElement(symbol: string) {
  return elements[symbol] ?? null;
}

/**
 * Get CPK color for an element
 */
export function getElementColor(symbol: string): string {
  return elements[symbol]?.cpkColor ?? '#808080';
}

/**
 * Get covalent radius for an element (in Angstroms)
 */
export function getCovalentRadius(symbol: string): number {
  return elements[symbol]?.covalentRadius ?? 1.5;
}

/**
 * Get van der Waals radius for an element (in Angstroms)
 */
export function getVdWRadius(symbol: string): number {
  return elements[symbol]?.vanDerWaalsRadius ?? 2.0;
}

/**
 * Get atomic mass for an element
 */
export function getAtomicMass(symbol: string): number {
  return elements[symbol]?.atomicMass ?? 0;
}

/**
 * Check if element symbol is valid
 */
export function isValidElement(symbol: string): boolean {
  return symbol in elements;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOLECULAR CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate molecular weight from atoms
 */
export function calculateMolecularWeight(atoms: Atom[]): number {
  return atoms.reduce((sum, atom) => sum + getAtomicMass(atom.element), 0);
}

/**
 * Calculate molecular formula from atoms
 */
export function calculateMolecularFormula(atoms: Atom[]): string {
  const counts: Record<string, number> = {};

  atoms.forEach((atom) => {
    counts[atom.element] = (counts[atom.element] || 0) + 1;
  });

  // Standard order: C, H, then alphabetical
  const orderedElements: string[] = [];
  if (counts['C']) orderedElements.push('C');
  if (counts['H']) orderedElements.push('H');

  Object.keys(counts)
    .filter((el) => el !== 'C' && el !== 'H')
    .sort()
    .forEach((el) => orderedElements.push(el));

  return orderedElements
    .map((el) => {
      const count = counts[el];
      return count === 1 ? el : `${el}${subscriptNumber(count)}`;
    })
    .join('');
}

/**
 * Convert number to subscript Unicode characters
 */
export function subscriptNumber(n: number): string {
  const subscripts = '₀₁₂₃₄₅₆₇₈₉';
  return n
    .toString()
    .split('')
    .map((d) => subscripts[parseInt(d)])
    .join('');
}

/**
 * Convert subscript Unicode characters to normal numbers
 */
export function fromSubscript(str: string): string {
  const subscripts = '₀₁₂₃₄₅₆₇₈₉';
  return str
    .split('')
    .map((c) => {
      const idx = subscripts.indexOf(c);
      return idx >= 0 ? idx.toString() : c;
    })
    .join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRY CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate distance between two 3D points
 */
export function distance3D(
  p1: [number, number, number],
  p2: [number, number, number]
): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate midpoint between two 3D points
 */
export function midpoint3D(
  p1: [number, number, number],
  p2: [number, number, number]
): [number, number, number] {
  return [
    (p1[0] + p2[0]) / 2,
    (p1[1] + p2[1]) / 2,
    (p1[2] + p2[2]) / 2,
  ];
}

/**
 * Calculate the center of mass of a molecule
 */
export function calculateCenterOfMass(atoms: Atom[]): [number, number, number] {
  let totalMass = 0;
  let cx = 0;
  let cy = 0;
  let cz = 0;

  atoms.forEach((atom) => {
    const mass = getAtomicMass(atom.element);
    totalMass += mass;
    cx += atom.position[0] * mass;
    cy += atom.position[1] * mass;
    cz += atom.position[2] * mass;
  });

  if (totalMass === 0) return [0, 0, 0];

  return [cx / totalMass, cy / totalMass, cz / totalMass];
}

/**
 * Calculate bounding box of molecule
 */
export function calculateBoundingBox(atoms: Atom[]): {
  min: [number, number, number];
  max: [number, number, number];
  size: [number, number, number];
  center: [number, number, number];
} {
  if (atoms.length === 0) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0],
      size: [0, 0, 0],
      center: [0, 0, 0],
    };
  }

  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];

  atoms.forEach((atom) => {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], atom.position[i]);
      max[i] = Math.max(max[i], atom.position[i]);
    }
  });

  return {
    min,
    max,
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
    center: midpoint3D(min, max),
  };
}

/**
 * Calculate bond length between two atoms
 */
export function calculateBondLength(
  atoms: Atom[],
  bond: Bond
): number {
  const atom1 = atoms[bond.atomIndex1];
  const atom2 = atoms[bond.atomIndex2];

  if (!atom1 || !atom2) return 0;

  return distance3D(atom1.position, atom2.position);
}

/**
 * Calculate angle between three atoms (in degrees)
 */
export function calculateAngle(
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number]
): number {
  // Vectors from p2 to p1 and p2 to p3
  const v1 = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
  const v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];

  // Dot product
  const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

  // Magnitudes
  const mag1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2);
  const mag2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2);

  if (mag1 === 0 || mag2 === 0) return 0;

  // Clamp to avoid floating point errors
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));

  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/**
 * Calculate dihedral angle between four atoms (in degrees)
 */
export function calculateDihedral(
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  p4: [number, number, number]
): number {
  // Vectors
  const b1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  const b2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];
  const b3 = [p4[0] - p3[0], p4[1] - p3[1], p4[2] - p3[2]];

  // Cross products
  const n1 = cross(b1, b2);
  const n2 = cross(b2, b3);

  // Normalize b2
  const b2Mag = Math.sqrt(b2[0] ** 2 + b2[1] ** 2 + b2[2] ** 2);
  const b2Norm = b2.map((v) => v / b2Mag);

  // m1 = n1 x b2/|b2|
  const m1 = cross(n1, b2Norm);

  // x = n1 · n2
  const x = dot(n1, n2);
  // y = m1 · n2
  const y = dot(m1, n2);

  return (Math.atan2(y, x) * 180) / Math.PI;
}

// Helper: cross product
function cross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

// Helper: dot product
function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIT CONVERSIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert energy from Hartree to eV
 */
export function hartreeToEv(hartree: number): number {
  return hartree * HARTREE_TO_EV;
}

/**
 * Convert energy from eV to Hartree
 */
export function evToHartree(ev: number): number {
  return ev / HARTREE_TO_EV;
}

/**
 * Convert energy from Hartree to kJ/mol
 */
export function hartreeToKjMol(hartree: number): number {
  return hartree * HARTREE_TO_KJ;
}

/**
 * Convert distance from Angstroms to Bohr
 */
export function angstromToBohr(angstrom: number): number {
  return angstrom * ANGSTROM_TO_BOHR;
}

/**
 * Convert distance from Bohr to Angstroms
 */
export function bohrToAngstrom(bohr: number): number {
  return bohr / ANGSTROM_TO_BOHR;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOLECULE TRANSFORMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Center a molecule at origin
 */
export function centerMolecule(molecule: Molecule): Molecule {
  const center = calculateCenterOfMass(molecule.atoms);

  const centeredAtoms = molecule.atoms.map((atom) => ({
    ...atom,
    position: [
      atom.position[0] - center[0],
      atom.position[1] - center[1],
      atom.position[2] - center[2],
    ] as [number, number, number],
  }));

  return {
    ...molecule,
    atoms: centeredAtoms,
  };
}

/**
 * Scale molecule coordinates
 */
export function scaleMolecule(molecule: Molecule, factor: number): Molecule {
  const scaledAtoms = molecule.atoms.map((atom) => ({
    ...atom,
    position: [
      atom.position[0] * factor,
      atom.position[1] * factor,
      atom.position[2] * factor,
    ] as [number, number, number],
  }));

  return {
    ...molecule,
    atoms: scaledAtoms,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BOND TYPE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get display name for bond order
 */
export function getBondOrderName(order: number | 'aromatic'): string {
  if (order === 'aromatic') return 'Aromatic';
  switch (order) {
    case 1:
      return 'Single';
    case 2:
      return 'Double';
    case 3:
      return 'Triple';
    default:
      return 'Unknown';
  }
}

/**
 * Get bond color based on order
 */
export function getBondColor(order: number | 'aromatic'): string {
  if (order === 'aromatic') return '#9933ff';
  switch (order) {
    case 1:
      return '#666666';
    case 2:
      return '#00f5ff';
    case 3:
      return '#ff00ff';
    default:
      return '#666666';
  }
}

/**
 * Check if a bond is aromatic
 */
export function isAromaticBond(bond: Bond): boolean {
  return bond.order === 'aromatic';
}

// ═══════════════════════════════════════════════════════════════════════════
// SMILES HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Basic SMILES validation (very simple check)
 */
export function isValidSmiles(smiles: string): boolean {
  // Basic check for common patterns
  const validChars = /^[A-Za-z0-9@+\-\[\]()=#\\/.%]+$/;
  return validChars.test(smiles) && smiles.length > 0;
}

/**
 * Extract elements from a SMILES string (simplified)
 */
export function extractElementsFromSmiles(smiles: string): string[] {
  const elementPattern = /\[([A-Z][a-z]?)\]|([A-Z][a-z]?)|([cnops])/g;
  const matches = smiles.matchAll(elementPattern);
  const elements: string[] = [];

  for (const match of matches) {
    const element = match[1] || match[2] || match[3]?.toUpperCase();
    if (element && isValidElement(element)) {
      elements.push(element);
    }
  }

  return elements;
}
