import { create } from 'zustand';

export const useMetadataStore = create((set) => ({
  metadata: {},
  currentImageMetadata: null,
  filter: null,
  setMetadata: (imageId, metadata) =>
    set((state) => ({
      metadata: { ...state.metadata, [imageId]: metadata },
    })),
  setCurrentImageMetadata: (metadata) => set({ currentImageMetadata: metadata }),
  setFilter: (filter) => set({ filter }),
  clearMetadata: () => set({ metadata: {}, currentImageMetadata: null }),
}));

