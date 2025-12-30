/**
 * ============================================================================
 * Viewer Store
 * State management for 3D viewer settings
 * ============================================================================
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ViewerState, RenderStyle, MeasurementMode, Measurement } from '@/types';

interface ViewerStoreState extends ViewerState {
  // Actions
  setShowOrbitals: (show: boolean) => void;
  setShowBonds: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;
  setShowHydrogens: (show: boolean) => void;
  setRenderStyle: (style: RenderStyle) => void;
  setBackgroundColor: (color: string) => void;
  setBondThickness: (thickness: number) => void;
  setAtomScale: (scale: number) => void;
  setAutoRotate: (rotate: boolean) => void;
  setRotationSpeed: (speed: number) => void;
  setMeasurementMode: (mode: MeasurementMode) => void;
  addSelectedAtom: (index: number) => void;
  clearSelectedAtoms: () => void;
  addMeasurement: (measurement: Measurement) => void;
  removeMeasurement: (id: string) => void;
  clearMeasurements: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: ViewerState = {
  showOrbitals: false,
  showBonds: true,
  showLabels: false,
  showHydrogens: true,
  renderStyle: 'ball-and-stick',
  backgroundColor: '#0a0a0f',
  bondThickness: 0.08,
  atomScale: 0.6,
  autoRotate: true,
  rotationSpeed: 0.003,
  measurementMode: null,
  selectedAtoms: [],
  measurements: [],
  camera: {
    position: [0, 0, 12],
    target: [0, 0, 0],
    zoom: 1,
  },
  isFullscreen: false,
};

export const useViewerStore = create<ViewerStoreState>()(
  devtools(
    persist(
      (set) => ({
        ...defaultSettings,

        setShowOrbitals: (show) => set({ showOrbitals: show }),
        setShowBonds: (show) => set({ showBonds: show }),
        setShowLabels: (show) => set({ showLabels: show }),
        setShowHydrogens: (show) => set({ showHydrogens: show }),
        setRenderStyle: (style) => set({ renderStyle: style }),
        setBackgroundColor: (color) => set({ backgroundColor: color }),
        setBondThickness: (thickness) => set({ bondThickness: thickness }),
        setAtomScale: (scale) => set({ atomScale: scale }),
        setAutoRotate: (rotate) => set({ autoRotate: rotate }),
        setRotationSpeed: (speed) => set({ rotationSpeed: speed }),

        setMeasurementMode: (mode) =>
          set({
            measurementMode: mode,
            selectedAtoms: [], // Clear selections when mode changes
          }),

        addSelectedAtom: (index) =>
          set((state) => ({
            selectedAtoms: [...state.selectedAtoms, index],
          })),

        clearSelectedAtoms: () => set({ selectedAtoms: [] }),

        addMeasurement: (measurement) =>
          set((state) => ({
            measurements: [...state.measurements, measurement],
            selectedAtoms: [], // Clear after adding measurement
          })),

        removeMeasurement: (id) =>
          set((state) => ({
            measurements: state.measurements.filter((m) => m.id !== id),
          })),

        clearMeasurements: () => set({ measurements: [] }),

        setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),

        resetSettings: () => set(defaultSettings),
      }),
      {
        name: 'moleculab-viewer',
        partialize: (state) => ({
          showOrbitals: state.showOrbitals,
          showBonds: state.showBonds,
          showLabels: state.showLabels,
          showHydrogens: state.showHydrogens,
          renderStyle: state.renderStyle,
          backgroundColor: state.backgroundColor,
          bondThickness: state.bondThickness,
          atomScale: state.atomScale,
          autoRotate: state.autoRotate,
          rotationSpeed: state.rotationSpeed,
        }),
      }
    ),
    { name: 'ViewerStore' }
  )
);
