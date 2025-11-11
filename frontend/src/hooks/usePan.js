import { useCallback, useState } from 'react';
import { useImageStore } from '../store/imageStore.js';

export const usePan = () => {
  const { viewState, updateViewState } = useImageStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const startDrag = useCallback((x, y) => {
    setIsDragging(true);
    setDragStart({ x: x - viewState.panX, y: y - viewState.panY });
  }, [viewState.panX, viewState.panY]);

  const onDrag = useCallback(
    (x, y) => {
      if (!isDragging) return;
      updateViewState({
        panX: x - dragStart.x,
        panY: y - dragStart.y,
      });
    },
    [isDragging, dragStart, updateViewState]
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPan = useCallback(() => {
    updateViewState({ panX: 0, panY: 0 });
  }, [updateViewState]);

  return {
    panX: viewState.panX,
    panY: viewState.panY,
    isDragging,
    startDrag,
    onDrag,
    endDrag,
    resetPan,
  };
};

