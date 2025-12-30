/**
 * ============================================================================
 * Quantum Chemistry Type Definitions
 * ============================================================================
 */

export interface OrbitalData {
  type: 's' | 'p' | 'd' | 'f';
  energy: number;
  occupancy: number;
}

export interface ElectronDensityPoint {
  position: [number, number, number];
  density: number;
}

export interface ElectrostaticPotential {
  min: number;
  max: number;
  points: Array<{
    position: [number, number, number];
    value: number;
  }>;
}

export interface VibrationalMode {
  frequency: number;
  intensity: number;
  displacement: Array<[number, number, number]>;
}

export interface QuantumCalculationResult {
  method: string;
  basisSet: string;
  energy: number;
  converged: boolean;
  iterations: number;
  timestamp: string;
}
