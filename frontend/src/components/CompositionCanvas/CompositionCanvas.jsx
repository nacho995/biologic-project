import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { Box, Paper, Typography } from '@mui/material';
import { useCompositionStore } from '../../store/compositionStore.js';
import { getImage } from '../../services/api.js';
import { COLOR_PALETTE } from '../../types/image.types.js';

const BLEND_MODE_MAP = {
  normal: 'source-over',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  add: 'lighter',
  subtract: 'difference',
  difference: 'difference',
};

export const CompositionCanvas = () => {
  const { layers, getSortedLayers } = useCompositionStore();
  const [loadedImages, setLoadedImages] = useState({});
  const canvasRef = useRef(null);
  const sortedLayers = getSortedLayers().filter((l) => l.visible);

  useEffect(() => {
    // Cargar imágenes para las capas
    const loadImages = async () => {
      const imagePromises = sortedLayers.map(async (layer) => {
        if (loadedImages[layer.imageId]) return;

        try {
          const blob = await getImage(layer.imageId);
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.src = URL.createObjectURL(blob);

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          setLoadedImages((prev) => ({
            ...prev,
            [layer.imageId]: img,
          }));
        } catch (error) {
          console.error(`Error loading image ${layer.imageId}:`, error);
        }
      });

      await Promise.all(imagePromises);
    };

    loadImages();
  }, [sortedLayers.map((l) => l.imageId).join(',')]);

  const applyColorToImage = (image, colorId) => {
    const color = COLOR_PALETTE.find((c) => c.id === colorId);
    if (!color) return image;

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color.hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const coloredImage = new window.Image();
    coloredImage.src = canvas.toDataURL();
    return coloredImage;
  };

  if (sortedLayers.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Layers in Composition
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          To overlay images:
        </Typography>
        <Box sx={{ textAlign: 'left', maxWidth: 400 }}>
          <Typography variant="body2" color="text.secondary">
            1️⃣ Go to <strong>Image Manager</strong> tab<br />
            2️⃣ Click the <strong>+ button</strong> on images<br />
            3️⃣ Come back here to see them overlaid<br />
            4️⃣ Use the side panel to adjust opacity & blend modes
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper sx={{ p: 2 }}>
        <Stage width={800} height={600} ref={canvasRef}>
          <Layer>
            {sortedLayers.map((layer, index) => {
              const image = loadedImages[layer.imageId];
              if (!image) return null;

              const coloredImage = applyColorToImage(image, layer.colorId);

              return (
                <KonvaImage
                  key={layer.id}
                  image={coloredImage}
                  x={layer.position.x}
                  y={layer.position.y}
                  opacity={layer.opacity / 100}
                  scaleX={layer.scale}
                  scaleY={layer.scale}
                  globalCompositeOperation={BLEND_MODE_MAP[layer.blendMode] || 'source-over'}
                />
              );
            })}
          </Layer>
        </Stage>
      </Paper>
    </Box>
  );
};

