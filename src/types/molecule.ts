/**
 * ============================================================================
 * Molecule Type Definitions
 * Core types for molecular data structures
 * ============================================================================
 */

/**
 * Represents a single atom in a molecule
 */
export interface Atom {
  /** Element symbol (e.g., 'C', 'H', 'O', 'N') */
  element: string;
  /** 3D position [x, y, z] in Angstroms */
  position: [number, number, number];
  /** Display color (hex string) */
  color: string;
  /** Atomic radius in Angstroms */
  radius: number;
  /** Optional formal charge */
  formalCharge?: number;
  /** Optional atom label */
  label?: string;
}

/**
 * Bond order types
 */
export type BondOrder = 1 | 2 | 3 | 'aromatic';

/**
 * Represents a bond between two atoms
 */
export interface Bond {
  /** Index of first atom */
  atomIndex1: number;
  /** Index of second atom */
  atomIndex2: number;
  /** Bond order (single, double, triple, aromatic) */
  order: BondOrder;
}

/**
 * Quantum mechanical properties
 */
export interface QuantumProperties {
  /** Total energy in eV */
  energy: number;
  /** HOMO energy in eV */
  homo: number;
  /** LUMO energy in eV */
  lumo: number;
  /** HOMO-LUMO gap in eV */
  bandGap: number;
  /** Dipole moment in Debye */
  dipole: number;
  /** Optional polarizability */
  polarizability?: number;
}

/**
 * Complete molecule data structure
 */
export interface Molecule {
  /** Unique identifier */
  id: string;
  /** Common name */
  name: string;
  /** Molecular formula (e.g., 'H₂O', 'C₆H₆') */
  formula: string;
  /** SMILES string */
  smiles: string;
  /** Array of atoms */
  atoms: Atom[];
  /** Array of bonds (optional if inferred) */
  bonds: Bond[];
  /** Functional groups present */
  functionalGroups: string[];
  /** Quantum properties (optional) */
  quantum?: QuantumProperties;
  /** Molecular weight in g/mol */
  molecularWeight?: number;
  /** PubChem CID (if from PubChem) */
  pubchemCid?: number;
  /** InChI string */
  inchi?: string;
  /** Data source */
  source?: 'pubchem' | 'file' | 'manual' | 'sample';
}

/**
 * Molecule metadata for search results
 */
export interface MoleculeSearchResult {
  id: string;
  name: string;
  formula: string;
  molecularWeight?: number;
  pubchemCid?: number;
}

/**
 * Element data from periodic table
 */
export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  cpkColor: string;
  covalentRadius: number;
  vanDerWaalsRadius: number;
}
