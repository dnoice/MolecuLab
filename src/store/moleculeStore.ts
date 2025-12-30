/**
 * ============================================================================
 * Molecule Store
 * State management for molecule data
 * ============================================================================
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Molecule } from '@/types';
import sampleMoleculesJson from '@/data/sampleMolecules.json';

// Cast JSON import through unknown to handle tuple type inference
const sampleMolecules = sampleMoleculesJson as unknown as Record<string, Molecule>;

interface MoleculeState {
  // Data
  molecules: Record<string, Molecule>;
  selectedMoleculeId: string | null;
  recentMolecules: string[];

  // Actions
  selectMolecule: (id: string) => void;
  addMolecule: (molecule: Molecule) => void;
  removeMolecule: (id: string) => void;
  clearMolecules: () => void;

  // Computed
  getSelectedMolecule: () => Molecule | null;
  getMoleculeList: () => Molecule[];
}

export const useMoleculeStore = create<MoleculeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state with sample molecules
        molecules: sampleMolecules,
        selectedMoleculeId: 'benzene',
        recentMolecules: [],

        // Select a molecule
        selectMolecule: (id) => {
          set((state) => {
            const recent = [id, ...state.recentMolecules.filter((r) => r !== id)].slice(0, 10);
            return { selectedMoleculeId: id, recentMolecules: recent };
          });
        },

        // Add a new molecule
        addMolecule: (molecule) => {
          set((state) => ({
            molecules: { ...state.molecules, [molecule.id]: molecule },
          }));
        },

        // Remove a molecule
        removeMolecule: (id) => {
          set((state) => {
            const { [id]: removed, ...rest } = state.molecules;
            const newSelectedId =
              state.selectedMoleculeId === id ? Object.keys(rest)[0] || null : state.selectedMoleculeId;
            return {
              molecules: rest,
              selectedMoleculeId: newSelectedId,
              recentMolecules: state.recentMolecules.filter((r) => r !== id),
            };
          });
        },

        // Clear all non-sample molecules
        clearMolecules: () => {
          set({
            molecules: sampleMolecules,
            selectedMoleculeId: 'benzene',
            recentMolecules: [],
          });
        },

        // Get selected molecule
        getSelectedMolecule: () => {
          const state = get();
          return state.selectedMoleculeId ? state.molecules[state.selectedMoleculeId] || null : null;
        },

        // Get list of all molecules
        getMoleculeList: () => {
          const state = get();
          return Object.values(state.molecules);
        },
      }),
      {
        name: 'moleculab-molecules',
        partialize: (state) => ({
          recentMolecules: state.recentMolecules,
          selectedMoleculeId: state.selectedMoleculeId,
        }),
      }
    ),
    { name: 'MoleculeStore' }
  )
);
