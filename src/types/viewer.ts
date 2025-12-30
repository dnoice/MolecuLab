/**
 * ============================================================================
 * Viewer State Type Definitions
 * ============================================================================
 */

export type RenderStyle = 'ball-and-stick' | 'space-filling' | 'wireframe' | 'cartoon';

export type MeasurementMode = 'distance' | 'angle' | 'dihedral' | null;

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export interface Measurement {
  id: string;
  type: 'distance' | 'angle' | 'dihedral';
  atomIndices: number[];
  value: number;
  unit: string;
}

export interface ViewerSettings {
  showOrbitals: boolean;
  showBonds: boolean;
  showLabels: boolean;
  showHydrogens: boolean;
  renderStyle: RenderStyle;
  backgroundColor: string;
  bondThickness: number;
  atomScale: number;
  autoRotate: boolean;
  rotationSpeed: number;
}

export interface ViewerState extends ViewerSettings {
  measurementMode: MeasurementMode;
  selectedAtoms: number[];
  measurements: Measurement[];
  camera: CameraState;
  isFullscreen: boolean;
}
