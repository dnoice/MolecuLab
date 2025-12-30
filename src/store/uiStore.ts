/**
 * ============================================================================
 * UI Store
 * State management for UI elements
 * ============================================================================
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Tab = 'viewer' | 'nesting' | 'search' | 'import';
type Panel = 'info' | 'search' | 'nesting' | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Tab/Panel state
  activeTab: Tab;
  openPanels: Panel[];
  sidebarCollapsed: boolean;

  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;

  // Modal state
  modalOpen: string | null;

  // Toasts
  toasts: Toast[];

  // Actions
  setActiveTab: (tab: Tab) => void;
  togglePanel: (panel: Panel) => void;
  openPanel: (panel: Panel) => void;
  closePanel: (panel: Panel) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Initial state
      activeTab: 'viewer',
      openPanels: ['info'],
      sidebarCollapsed: false,
      isLoading: false,
      loadingMessage: null,
      modalOpen: null,
      toasts: [],

      // Tab navigation
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Panel management
      togglePanel: (panel) =>
        set((state) => ({
          openPanels: state.openPanels.includes(panel)
            ? state.openPanels.filter((p) => p !== panel)
            : [...state.openPanels, panel],
        })),

      openPanel: (panel) =>
        set((state) => ({
          openPanels: state.openPanels.includes(panel) ? state.openPanels : [...state.openPanels, panel],
        })),

      closePanel: (panel) =>
        set((state) => ({
          openPanels: state.openPanels.filter((p) => p !== panel),
        })),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      // Loading state
      setLoading: (loading, message) =>
        set({
          isLoading: loading,
          loadingMessage: loading ? message || null : null,
        }),

      // Modal management
      openModal: (modalId) => set({ modalOpen: modalId }),
      closeModal: () => set({ modalOpen: null }),

      // Toast notifications
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id: `toast-${Date.now()}-${Math.random()}` }],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    { name: 'UIStore' }
  )
);
