import { create } from 'zustand';
import { COLOR_PALETTE } from '../types/image.types.js';

const createInitialAdjustments = () => {
  return COLOR_PALETTE.map((color, index) => ({
    colorId: color.id,
    channel: index, // Asignar cada color a un canal diferente por defecto
    enabled: false, // All colors disabled by default
    contrast: 100,
  }));
};

export const useColorStore = create((set) => ({
  palette: COLOR_PALETTE,
  adjustments: createInitialAdjustments(),
  initializeAdjustments: () =>
    set({ adjustments: createInitialAdjustments() }),
  toggleColor: (colorId) =>
    set((state) => ({
      adjustments: state.adjustments.map((adj) =>
        adj.colorId === colorId ? { ...adj, enabled: !adj.enabled } : adj
      ),
    })),
  setContrast: (colorId, contrast) =>
    set((state) => ({
      adjustments: state.adjustments.map((adj) =>
        adj.colorId === colorId
          ? { ...adj, contrast: Math.max(50, Math.min(150, contrast)) }
          : adj
      ),
    })),
  assignColorToChannel: (colorId, channel) =>
    set((state) => ({
      adjustments: state.adjustments.map((adj) =>
        adj.colorId === colorId ? { ...adj, channel } : adj
      ),
    })),
  resetColors: () => set({ adjustments: createInitialAdjustments() }),
}));

