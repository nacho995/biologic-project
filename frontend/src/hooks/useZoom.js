import { useCallback } from 'react';
import { useImageStore } from '../store/imageStore.js';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.1;

export const useZoom = () => {
  const { viewState, updateViewState } = useImageStore();

  const zoomIn = useCallback(() => {
    updateViewState({
      zoom: Math.min(MAX_ZOOM, viewState.zoom + ZOOM_STEP),
    });
  }, [viewState.zoom, updateViewState]);

  const zoomOut = useCallback(() => {
    updateViewState({
      zoom: Math.max(MIN_ZOOM, viewState.zoom - ZOOM_STEP),
    });
  }, [viewState.zoom, updateViewState]);

  const setZoom = useCallback(
    (zoom) => {
      updateViewState({
        zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)),
      });
    },
    [updateViewState]
  );

  const resetZoom = useCallback(() => {
    updateViewState({ zoom: 1 });
  }, [updateViewState]);

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      updateViewState({
        zoom: Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, viewState.zoom + delta)
        ),
      });
    },
    [viewState.zoom, updateViewState]
  );

  return {
    zoom: viewState.zoom,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
    handleWheel,
  };
};

