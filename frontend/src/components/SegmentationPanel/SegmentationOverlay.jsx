import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

export const SegmentationOverlay = ({ 
  baseImageUrl, 
  maskUrl, 
  opacity = 0.5,
  blendMode = 'multiply'
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!baseImageUrl || !maskUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const baseImg = new Image();
    const maskImg = new Image();

    baseImg.crossOrigin = 'anonymous';
    maskImg.crossOrigin = 'anonymous';

    Promise.all([
      new Promise((resolve) => {
        baseImg.onload = resolve;
        baseImg.src = baseImageUrl;
      }),
      new Promise((resolve) => {
        maskImg.onload = resolve;
        maskImg.src = maskUrl;
      })
    ]).then(() => {
      // Set canvas size
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      // Draw base image
      ctx.drawImage(baseImg, 0, 0);

      // Set blend mode and opacity
      ctx.globalCompositeOperation = blendMode;
      ctx.globalAlpha = opacity;

      // Draw mask overlay
      ctx.drawImage(maskImg, 0, 0);

      // Reset
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    });
  }, [baseImageUrl, maskUrl, opacity, blendMode]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        width: '100%',
        height: 'auto',
        display: 'block',
        borderRadius: 1,
        border: '1px solid #E5E7EB'
      }}
    />
  );
};

