/**
 * ============================================================================
 * API Response Type Definitions
 * ============================================================================
 */

// PubChem API Types
export interface PubChemCompoundResponse {
  PC_Compounds: PubChemCompound[];
}

export interface PubChemCompound {
  id: {
    id: {
      cid: number;
    };
  };
  atoms: {
    aid: number[];
    element: number[];
  };
  bonds?: {
    aid1: number[];
    aid2: number[];
    order: number[];
  };
  coords?: Array<{
    type: number[];
    aid: number[];
    conformers: Array<{
      x: number[];
      y: number[];
      z?: number[];
    }>;
  }>;
  props?: PubChemProperty[];
}

export interface PubChemProperty {
  urn: {
    label: string;
    name?: string;
  };
  value: {
    sval?: string;
    fval?: number;
    ival?: number;
  };
}

export interface PubChemSearchResult {
  CID: number;
  Title: string;
  MolecularFormula: string;
  MolecularWeight: number;
}

export interface PubChem3DConformer {
  conformers: Array<{
    x: number[];
    y: number[];
    z: number[];
  }>;
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  cached: boolean;
  timestamp: number;
}
