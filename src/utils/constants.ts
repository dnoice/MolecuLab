/**
 * ============================================================================
 * MolecuLab Application Constants
 * Global constants used throughout the application
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const API_ENDPOINTS = {
  PUBCHEM_BASE: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug',
  PUBCHEM_COMPOUND: '/compound',
  PUBCHEM_SEARCH: '/compound/name',
  PUBCHEM_AUTOCOMPLETE: 'https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// VIEWER SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export const VIEWER_DEFAULTS = {
  /** Default camera distance from molecule */
  CAMERA_DISTANCE: 10,
  /** Default camera field of view */
  CAMERA_FOV: 75,
  /** Near clipping plane */
  CAMERA_NEAR: 0.1,
  /** Far clipping plane */
  CAMERA_FAR: 1000,
  /** Default atom scale factor */
  ATOM_SCALE: 0.4,
  /** Default bond radius */
  BOND_RADIUS: 0.1,
  /** Auto-rotate speed (radians per second) */
  AUTO_ROTATE_SPEED: 0.5,
  /** Ambient light intensity */
  AMBIENT_LIGHT: 0.4,
  /** Point light intensity */
  POINT_LIGHT: 1.0,
} as const;

export const RENDER_MODES = {
  BALL_AND_STICK: 'ball-and-stick',
  SPACE_FILLING: 'space-filling',
  WIREFRAME: 'wireframe',
  SURFACE: 'surface',
} as const;

export type RenderMode = (typeof RENDER_MODES)[keyof typeof RENDER_MODES];

// ═══════════════════════════════════════════════════════════════════════════
// FILE FORMATS
// ═══════════════════════════════════════════════════════════════════════════

export const SUPPORTED_FILE_FORMATS = {
  /** Structure Data File */
  SDF: '.sdf',
  /** MOL file format */
  MOL: '.mol',
  /** XYZ coordinate file */
  XYZ: '.xyz',
  /** Protein Data Bank format */
  PDB: '.pdb',
  /** SMILES string (text) */
  SMILES: '.smi',
  /** MOL2 format */
  MOL2: '.mol2',
} as const;

export const FILE_MIME_TYPES: Record<string, string[]> = {
  '.sdf': ['chemical/x-mdl-sdfile'],
  '.mol': ['chemical/x-mdl-molfile'],
  '.xyz': ['chemical/x-xyz'],
  '.pdb': ['chemical/x-pdb'],
  '.smi': ['chemical/x-daylight-smiles', 'text/plain'],
  '.mol2': ['chemical/x-mol2'],
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT FORMATS
// ═══════════════════════════════════════════════════════════════════════════

export const EXPORT_FORMATS = {
  PNG: 'png',
  JPEG: 'jpeg',
  PDF: 'pdf',
  GLB: 'glb',
  GLTF: 'gltf',
  SVG: 'svg',
} as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[keyof typeof EXPORT_FORMATS];

export const EXPORT_RESOLUTIONS = {
  SD: { width: 1280, height: 720, label: 'SD (720p)' },
  HD: { width: 1920, height: 1080, label: 'HD (1080p)' },
  '2K': { width: 2560, height: 1440, label: '2K (1440p)' },
  '4K': { width: 3840, height: 2160, label: '4K (2160p)' },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CHEMISTRY CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Avogadro's number */
export const AVOGADRO = 6.02214076e23;

/** Bohr radius in Angstroms */
export const BOHR_RADIUS = 0.529177;

/** Hartree to eV conversion */
export const HARTREE_TO_EV = 27.2114;

/** Hartree to kJ/mol conversion */
export const HARTREE_TO_KJ = 2625.5;

/** Angstrom to Bohr conversion */
export const ANGSTROM_TO_BOHR = 1.8897259886;

// ═══════════════════════════════════════════════════════════════════════════
// UI CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const SIDEBAR_WIDTH = {
  COLLAPSED: 60,
  EXPANDED: 280,
} as const;

export const PANEL_SIZES = {
  PROPERTIES: { width: 320, minWidth: 280, maxWidth: 400 },
  SEARCH: { width: 360, minWidth: 300, maxWidth: 480 },
  TOOLS: { width: 280, minWidth: 240, maxWidth: 360 },
} as const;

export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
  PERSISTENT: 0,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH & CACHE
// ═══════════════════════════════════════════════════════════════════════════

export const SEARCH_DEBOUNCE_MS = 300;

export const SEARCH_MIN_CHARS = 2;

export const CACHE_DURATION = {
  /** Molecule data cache duration (24 hours) */
  MOLECULE: 24 * 60 * 60 * 1000,
  /** Search results cache duration (1 hour) */
  SEARCH: 60 * 60 * 1000,
  /** Image cache duration (7 days) */
  IMAGE: 7 * 24 * 60 * 60 * 1000,
} as const;

export const CACHE_KEYS = {
  MOLECULES: 'moleculab_molecules',
  SEARCH_HISTORY: 'moleculab_search_history',
  FAVORITES: 'moleculab_favorites',
  SETTINGS: 'moleculab_settings',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

export const VALIDATION = {
  MAX_ATOMS: 10000,
  MAX_BONDS: 15000,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_MOLECULE_NAME_LENGTH: 256,
  MAX_SEARCH_RESULTS: 100,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════════════════

export const KEYBOARD_SHORTCUTS = {
  SEARCH: { key: 'k', modifier: 'ctrl', description: 'Open search' },
  RESET_VIEW: { key: 'r', modifier: 'ctrl', description: 'Reset view' },
  TOGGLE_SIDEBAR: { key: 'b', modifier: 'ctrl', description: 'Toggle sidebar' },
  EXPORT: { key: 'e', modifier: 'ctrl+shift', description: 'Export molecule' },
  FULLSCREEN: { key: 'f', modifier: 'ctrl', description: 'Toggle fullscreen' },
  UNDO: { key: 'z', modifier: 'ctrl', description: 'Undo' },
  REDO: { key: 'y', modifier: 'ctrl', description: 'Redo' },
} as const;
