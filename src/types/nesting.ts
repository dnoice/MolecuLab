/**
 * ============================================================================
 * Substrate Nesting Type Definitions
 * ============================================================================
 */

export interface SubstrateDimensions {
  width: number;
  height: number;
}

export interface MoleculePlacement {
  id: number;
  molecule: string;
  x: number;
  y: number;
  radius: number;
  rotation: number;
}

export interface NestingResult {
  substrate: SubstrateDimensions;
  placements: MoleculePlacement[];
  utilization: number;
  numPlaced: number;
  numTotal: number;
}

export interface NestingConfig {
  spacing: number;
  rotationStep: number;
  maxIterations: number;
}
