import { create } from 'zustand';

const initialViewState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  currentPlane: 'z',
  planeIndex: 0,
};

export const useImageStore = create((set) => ({
  images: [],
  currentImageId: null,
  viewState: initialViewState,
  setImages: (images) => set({ images }),
  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),
  setCurrentImage: (id) => set({ currentImageId: id }),
  updateViewState: (newState) =>
    set((state) => ({
      viewState: { ...state.viewState, ...newState },
    })),
  resetView: () => set({ viewState: initialViewState }),
}));

