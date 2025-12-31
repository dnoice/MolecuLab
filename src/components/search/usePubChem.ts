/**
 * ============================================================================
 * usePubChem Hook
 * React hook for searching and fetching molecules from PubChem API
 * ============================================================================
 */
import { useState, useCallback } from 'react';
import type { Molecule, Atom, Bond } from '../viewer';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PubChemCompound {
  cid: number;
  name: string;
  molecularFormula: string;
  molecularWeight: number;
  iupacName?: string;
  synonyms?: string[];
  smiles?: string;
}

export interface PubChemSearchResult {
  compounds: PubChemCompound[];
  total: number;
}

export interface UsePubChemReturn {
  searchCompounds: (query: string) => Promise<void>;
  fetchMolecule: (cid: number) => Promise<Molecule | null>;
  results: PubChemCompound[];
  isSearching: boolean;
  isFetching: boolean;
  error: string | null;
  clearResults: () => void;
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
};

// ═══════════════════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function usePubChem(): UsePubChemReturn {
  const [results, setResults] = useState<PubChemCompound[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompounds = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Search by name
      const searchUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(query)}/cids/JSON?name_type=word`;
      const searchRes = await fetch(searchUrl);

      if (!searchRes.ok) {
        if (searchRes.status === 404) {
          setResults([]);
          return;
        }
        throw new Error('Search failed');
      }

      const searchData = await searchRes.json();
      const cids: number[] = searchData.IdentifierList?.CID?.slice(0, 10) || [];

      if (cids.length === 0) {
        setResults([]);
        return;
      }

      // Get compound properties
      const propsUrl = `${PUBCHEM_BASE}/compound/cid/${cids.join(',')}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`;
      const propsRes = await fetch(propsUrl);

      if (!propsRes.ok) throw new Error('Failed to fetch properties');

      const propsData = await propsRes.json();
      const properties = propsData.PropertyTable?.Properties || [];

      const compounds: PubChemCompound[] = properties.map((prop: {
        CID: number;
        MolecularFormula: string;
        MolecularWeight: number;
        IUPACName?: string;
      }) => ({
        cid: prop.CID,
        name: prop.IUPACName || query,
        molecularFormula: prop.MolecularFormula,
        molecularWeight: prop.MolecularWeight,
        iupacName: prop.IUPACName,
      }));

      setResults(compounds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const fetchMolecule = useCallback(async (cid: number): Promise<Molecule | null> => {
    setIsFetching(true);
    setError(null);

    try {
      // Fetch 3D conformer
      const url = `${PUBCHEM_BASE}/compound/cid/${cid}/JSON?record_type=3d`;
      const res = await fetch(url);

      if (!res.ok) {
        // Try 2D if 3D not available
        const url2d = `${PUBCHEM_BASE}/compound/cid/${cid}/JSON`;
        const res2d = await fetch(url2d);
        if (!res2d.ok) throw new Error('Failed to fetch molecule');
        const data = await res2d.json();
        return parsePubChemData(data, cid, false);
      }

      const data = await res.json();
      return parsePubChemData(data, cid, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch molecule');
      return null;
    } finally {
      setIsFetching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    searchCompounds,
    fetchMolecule,
    results,
    isSearching,
    isFetching,
    error,
    clearResults,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSER
// ═══════════════════════════════════════════════════════════════════════════

interface PubChemAtom {
  aid: number;
  element: number;
}

interface PubChemCoord {
  aid: number[];
  conformers: Array<{
    x: number[];
    y: number[];
    z?: number[];
  }>;
}

interface PubChemBond {
  aid1: number[];
  aid2: number[];
  order?: number[];
}

interface PubChemRecord {
  id: { id: { cid: number } };
  atoms: PubChemAtom;
  bonds?: PubChemBond;
  coords?: PubChemCoord[];
  props?: Array<{
    urn: { label: string };
    value: { sval?: string };
  }>;
}

const ATOMIC_SYMBOLS: Record<number, string> = {
  1: 'H', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 15: 'P', 16: 'S', 17: 'Cl', 35: 'Br', 53: 'I',
};

function parsePubChemData(
  data: { PC_Compounds: PubChemRecord[] },
  cid: number,
  is3d: boolean
): Molecule | null {
  const compound = data.PC_Compounds?.[0];
  if (!compound) return null;

  const atomData = compound.atoms;
  const bondData = compound.bonds;
  const coordData = compound.coords?.[0];

  if (!atomData || !coordData) return null;

  // Get name from props
  let name = `CID ${cid}`;
  const nameProp = compound.props?.find((p) => p.urn.label === 'IUPAC Name');
  if (nameProp?.value?.sval) name = nameProp.value.sval;

  // Parse atoms
  const atoms: Atom[] = [];
  const aidToIdx: Map<number, number> = new Map();
  const conformer = coordData.conformers[0];

  for (let i = 0; i < coordData.aid.length; i++) {
    const aid = coordData.aid[i];
    const elementNum = atomData.element;
    const element = ATOMIC_SYMBOLS[Array.isArray(elementNum) ? elementNum[i] : elementNum] || 'C';

    aidToIdx.set(aid, i);

    atoms.push({
      id: `${element}${aid}`,
      element,
      position: {
        x: conformer.x[i],
        y: conformer.y[i],
        z: is3d && conformer.z ? conformer.z[i] : 0,
      },
      color: ELEMENT_COLORS[element] || '#888888',
      radius: ELEMENT_RADII[element] || 1.5,
    });
  }

  // Parse bonds
  const bonds: Bond[] = [];
  if (bondData?.aid1 && bondData?.aid2) {
    for (let i = 0; i < bondData.aid1.length; i++) {
      const aid1 = bondData.aid1[i];
      const aid2 = bondData.aid2[i];
      const order = bondData.order?.[i] || 1;

      const idx1 = aidToIdx.get(aid1);
      const idx2 = aidToIdx.get(aid2);

      if (idx1 !== undefined && idx2 !== undefined) {
        bonds.push({
          id: `b${i + 1}`,
          atom1Id: atoms[idx1].id,
          atom2Id: atoms[idx2].id,
          order: (order as 1 | 2 | 3) || 1,
        });
      }
    }
  }

  return {
    id: `pubchem-${cid}`,
    name,
    atoms,
    bonds,
  };
}

export default usePubChem;
