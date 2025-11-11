import { create } from 'zustand';
import { COLOR_PALETTE } from '../types/image.types.js';

const BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'add',
  'subtract',
  'difference',
];

const createInitialLayer = (imageId, colorId = 1) => ({
  id: Date.now().toString(),
  imageId,
  colorId,
  opacity: 100,
  blendMode: 'normal',
  visible: true,
  order: 0,
  position: { x: 0, y: 0 },
  scale: 1,
});

export const useCompositionStore = create((set, get) => ({
  layers: [],
  currentCompositionId: null,
  compositionName: '',
  compositionDescription: '',

  addLayer: (imageId, colorId = 1) => {
    const layers = get().layers;
    const newLayer = createInitialLayer(imageId, colorId);
    newLayer.order = layers.length;
    set((state) => ({
      layers: [...state.layers, newLayer],
    }));
  },

  removeLayer: (layerId) => {
    set((state) => {
      const filtered = state.layers.filter((l) => l.id !== layerId);
      // Reordenar
      const reordered = filtered.map((layer, index) => ({
        ...layer,
        order: index,
      }));
      return { layers: reordered };
    });
  },

  updateLayer: (layerId, updates) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
    }));
  },

  toggleLayerVisibility: (layerId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  },

  moveLayerUp: (layerId) => {
    set((state) => {
      const layers = [...state.layers];
      const index = layers.findIndex((l) => l.id === layerId);
      if (index < layers.length - 1) {
        [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
        layers[index].order = index;
        layers[index + 1].order = index + 1;
        return { layers };
      }
      return state;
    });
  },

  moveLayerDown: (layerId) => {
    set((state) => {
      const layers = [...state.layers];
      const index = layers.findIndex((l) => l.id === layerId);
      if (index > 0) {
        [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
        layers[index].order = index;
        layers[index - 1].order = index - 1;
        return { layers };
      }
      return state;
    });
  },

  setComposition: (composition) => {
    set({
      currentCompositionId: composition.id,
      compositionName: composition.name,
      compositionDescription: composition.description || '',
      layers: composition.layers || [],
    });
  },

  clearComposition: () => {
    set({
      layers: [],
      currentCompositionId: null,
      compositionName: '',
      compositionDescription: '',
    });
  },

  getSortedLayers: () => {
    const layers = get().layers;
    return [...layers].sort((a, b) => a.order - b.order);
  },
}));

export { BLEND_MODES };

