import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { Box, Paper } from '@mui/material';
import { useImageLoader } from '../../hooks/useImageLoader.js';
import { useZoom } from '../../hooks/useZoom.js';
import { usePan } from '../../hooks/usePan.js';
import { useImageStore } from '../../store/imageStore.js';
import { useColorAdjustment } from '../../hooks/useColorAdjustment.js';

export const ImageViewer = () => {
  const { currentImageId } = useImageStore();
  const { imageUrl, loading } = useImageLoader(currentImageId);
  const { zoom, handleWheel } = useZoom();
  const { panX, panY, startDrag, onDrag, endDrag } = usePan();
  const { processedImageUrl } = useColorAdjustment();
  const imageRef = useRef(null);
  const [image, setImage] = React.useState(null);
  
  // Debug logging
  React.useEffect(() => {
    console.log('ImageViewer - currentImageId:', currentImageId);
    console.log('ImageViewer - imageUrl:', imageUrl);
    console.log('ImageViewer - loading:', loading);
  }, [currentImageId, imageUrl, loading]);

  useEffect(() => {
    if (!imageUrl && !processedImageUrl) {
      console.log('ImageViewer - No image URL available');
      setImage(null);
      return;
    }
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('ImageViewer - Image loaded successfully into HTML Image element');
      setImage(img);
    };
    
    img.onerror = (error) => {
      console.error('ImageViewer - Error loading image into HTML Image element:', error);
      console.error('ImageViewer - Attempted URL:', img.src);
    };
    
    const srcUrl = processedImageUrl || imageUrl;
    console.log('ImageViewer - Setting image src to:', srcUrl);
    img.src = srcUrl;
    
    return () => {
      console.log('ImageViewer - Cleaning up image');
    };
  }, [imageUrl, processedImageUrl]);

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    startDrag(pointerPos.x, pointerPos.y);
  };

  const handleMouseMove = (e) => {
    if (!e.target.getStage()) return;
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    onDrag(pointerPos.x, pointerPos.y);
  };

  const handleMouseUp = () => {
    endDrag();
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        Loading image...
      </Paper>
    );
  }

  if (!image) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        No image selected
      </Paper>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        // Fondo transparente - se verá el azul gradiente del body
        backgroundColor: 'transparent',
        // Patrón de tablero para visualizar transparencia (opcional)
        backgroundImage: 'none',
      }}
    >
      <Stage
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          // IMPORTANTE: Canvas sin fondo - respeta transparencia de PNG
          backgroundColor: 'transparent',
        }}
      >
        <Layer
          // Layer sin clearing - respeta transparencia
          clearBeforeDraw={true}
        >
          <KonvaImage
            ref={imageRef}
            image={image}
            x={panX}
            y={panY}
            scaleX={zoom}
            scaleY={zoom}
          />
        </Layer>
      </Stage>
    </Box>
  );
};

