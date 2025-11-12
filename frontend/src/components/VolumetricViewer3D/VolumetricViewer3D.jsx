import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  IconButton,
  Stack,
  Chip,
  Alert,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  ViewInAr,
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  ThreeDRotation,
  ZoomIn,
  ZoomOut,
  RestartAlt,
} from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';
import { useColorStore } from '../../store/colorStore.js';
import { getSlice } from '../../services/api.js';

export const VolumetricViewer3D = () => {
  const { currentImageId, images } = useImageStore();
  const { colors } = useColorStore();
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [sliceIndex, setSliceIndex] = useState(0);
  const [maxSlices, setMaxSlices] = useState(1);
  const [viewMode, setViewMode] = useState('volume');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [opacity, setOpacity] = useState(0.8);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  
  const [sliceImages, setSliceImages] = useState([]);
  const [imageInfo, setImageInfo] = useState(null);
  
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Get current image info
  useEffect(() => {
    if (currentImageId && images.length > 0) {
      const img = images.find(i => i.id === currentImageId);
      if (img && img.dimensions) {
        setImageInfo(img.dimensions);
        const depth = img.dimensions.depth || img.dimensions.slices || 1;
        setMaxSlices(depth);
        setSliceIndex(Math.floor(depth / 2));
        setError(null);
        loadAllSlices(depth);
      } else {
        setError('No 3D image loaded');
      }
    }
  }, [currentImageId, images]);

  // Load all slices for 3D rendering
  const loadAllSlices = async (depth) => {
    if (!currentImageId) return;
    
    setLoading(true);
    try {
      const slicePromises = [];
      for (let i = 0; i < Math.min(depth, 100); i++) {
        slicePromises.push(loadSliceImage(i));
      }
      
      const loadedImages = await Promise.all(slicePromises);
      setSliceImages(loadedImages.filter(img => img !== null));
      setError(null);
    } catch (err) {
      console.error('Error loading slices:', err);
      setError('Failed to load 3D image slices');
    } finally {
      setLoading(false);
    }
  };

  // Load individual slice as Image object
  const loadSliceImage = (index) => {
    return new Promise((resolve) => {
      getSlice(currentImageId, 'z', index)
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = url;
        })
        .catch(() => resolve(null));
    });
  };

  // Apply color adjustments based on color store
  const applyColorAdjustments = useCallback((ctx, imageData) => {
    const data = imageData.data;
    
    if (!colors || !Array.isArray(colors)) {
      return imageData;
    }
    
    const activeColors = colors.filter(c => c.enabled);
    
    if (activeColors.length === 0) {
      return imageData;
    }

    for (let i = 0; i < data.length; i += 4) {
      let r = 0, g = 0, b = 0;
      
      activeColors.forEach(color => {
        const channelValue = data[i + color.channel];
        const adjusted = channelValue * (color.contrast / 100);
        
        const rgb = hexToRgb(color.color);
        r += (adjusted / 255) * rgb.r;
        g += (adjusted / 255) * rgb.g;
        b += (adjusted / 255) * rgb.b;
      });
      
      data[i] = Math.min(255, r * brightness);
      data[i + 1] = Math.min(255, g * brightness);
      data[i + 2] = Math.min(255, b * brightness);
      data[i + 3] = data[i + 3] * opacity;
    }
    
    return imageData;
  }, [colors, brightness, opacity]);

  // Render current slice or 3D projection
  useEffect(() => {
    if (!canvasRef.current || sliceImages.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (viewMode === 'slice') {
      renderSlice(ctx, canvas);
    } else if (viewMode === 'mip') {
      renderMIP(ctx, canvas);
    } else {
      renderVolume(ctx, canvas);
    }
  }, [sliceImages, sliceIndex, viewMode, zoom, rotation, brightness, contrast, opacity, colors]);

  // Render single slice
  const renderSlice = (ctx, canvas) => {
    const img = sliceImages[sliceIndex];
    if (!img) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    
    ctx.save();
    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    
    if (colors && Array.isArray(colors) && colors.some(c => c.enabled)) {
      const imageData = ctx.getImageData(x, y, w, h);
      const adjustedData = applyColorAdjustments(ctx, imageData);
      ctx.putImageData(adjustedData, x, y);
    }
  };

  // Render Maximum Intensity Projection
  const renderMIP = (ctx, canvas) => {
    if (sliceImages.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sliceImages[0].width;
    tempCanvas.height = sliceImages[0].height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    sliceImages.forEach((img, idx) => {
      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      
      if (idx === 0) {
        ctx.putImageData(imageData, 0, 0);
      } else {
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const maxR = Math.max(currentData.data[i], imageData.data[i]);
          const maxG = Math.max(currentData.data[i + 1], imageData.data[i + 1]);
          const maxB = Math.max(currentData.data[i + 2], imageData.data[i + 2]);
          currentData.data[i] = maxR;
          currentData.data[i + 1] = maxG;
          currentData.data[i + 2] = maxB;
        }
        ctx.putImageData(currentData, 0, 0);
      }
    });
    
    const scale = zoom;
    const finalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const w = tempCanvas.width * scale;
    const h = tempCanvas.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    
    ctx.save();
    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
    ctx.globalAlpha = opacity;
    
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = tempCanvas.width;
    scaledCanvas.height = tempCanvas.height;
    const scaledCtx = scaledCanvas.getContext('2d');
    scaledCtx.putImageData(finalImage, 0, 0);
    ctx.drawImage(scaledCanvas, x, y, w, h);
    ctx.restore();
  };

  // Render volume with alpha blending
  const renderVolume = (ctx, canvas) => {
    if (sliceImages.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = zoom;
    const w = sliceImages[0].width * scale;
    const h = sliceImages[0].height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    
    ctx.save();
    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
    
    const alphaPerSlice = opacity / sliceImages.length;
    
    sliceImages.forEach((img, idx) => {
      ctx.globalAlpha = alphaPerSlice * 2;
      ctx.drawImage(img, x, y, w, h);
    });
    
    ctx.restore();
    
    if (colors && Array.isArray(colors) && colors.some(c => c.enabled)) {
      const imageData = ctx.getImageData(x, y, w, h);
      const adjustedData = applyColorAdjustments(ctx, imageData);
      ctx.putImageData(adjustedData, x, y);
    }
  };

  // Auto-play slices
  useEffect(() => {
    if (isPlaying && viewMode === 'slice') {
      const interval = setInterval(() => {
        setSliceIndex(prev => (prev + 1) % maxSlices);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, maxSlices, viewMode]);

  // Mouse interaction for rotation (in volume mode)
  const handleMouseDown = (e) => {
    if (viewMode === 'volume' || viewMode === 'mip') {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
        z: prev.z,
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
    setBrightness(1);
    setContrast(1);
    setOpacity(0.8);
  };

  // Helper function
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 255, g: 255, b: 255 };
  };

  if (!currentImageId || !imageInfo) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <ViewInAr sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          3D Volumetric Viewer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a TIFF image with multiple slices to view in 3D
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Stack spacing={2}>
          {/* View Mode Selection */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Rendering Mode
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="slice">Slice</ToggleButton>
              <ToggleButton value="volume">Volume</ToggleButton>
              <ToggleButton value="mip">MIP</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Slice Navigation (for slice mode) */}
          {viewMode === 'slice' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <IconButton size="small" onClick={() => setSliceIndex(Math.max(0, sliceIndex - 1))}>
                  <SkipPrevious />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setIsPlaying(!isPlaying)}
                  color={isPlaying ? 'primary' : 'default'}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton size="small" onClick={() => setSliceIndex(Math.min(maxSlices - 1, sliceIndex + 1))}>
                  <SkipNext />
                </IconButton>
                <Chip
                  label={`Slice ${sliceIndex + 1} / ${maxSlices}`}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Box>
              <Slider
                value={sliceIndex}
                min={0}
                max={maxSlices - 1}
                step={1}
                onChange={(_, value) => setSliceIndex(value)}
                valueLabelDisplay="auto"
              />
            </Box>
          )}

          {/* Zoom Control */}
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Zoom: {(zoom * 100).toFixed(0)}%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>
                <ZoomOut />
              </IconButton>
              <Slider
                value={zoom}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(_, value) => setZoom(value)}
                sx={{ flex: 1 }}
              />
              <IconButton size="small" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
                <ZoomIn />
              </IconButton>
            </Box>
          </Box>

          {/* Opacity Control */}
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Opacity: {(opacity * 100).toFixed(0)}%
            </Typography>
            <Slider
              value={opacity}
              min={0}
              max={1}
              step={0.05}
              onChange={(_, value) => setOpacity(value)}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            />
          </Box>

          {/* Brightness & Contrast */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Brightness
              </Typography>
              <Slider
                value={brightness}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(_, value) => setBrightness(value)}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Contrast
              </Typography>
              <Slider
                value={contrast}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(_, value) => setContrast(value)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>

          {/* Reset Button */}
          <Button
            startIcon={<RestartAlt />}
            onClick={resetView}
            size="small"
            variant="outlined"
          >
            Reset View
          </Button>
        </Stack>
      </Paper>

      {/* Canvas */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          height: 600,
          backgroundColor: '#000000',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          cursor: viewMode === 'volume' || viewMode === 'mip' ? 'grab' : 'default',
          '&:active': {
            cursor: viewMode === 'volume' || viewMode === 'mip' ? 'grabbing' : 'default',
          },
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <LinearProgress />
          </Box>
        )}
        
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {imageInfo && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: alpha('#000000', 0.7),
              color: '#FFFFFF',
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="caption">
              {imageInfo.width} × {imageInfo.height} × {maxSlices} | {viewMode.toUpperCase()}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Instructions */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 2,
          backgroundColor: alpha('#2196F3', 0.05),
          border: '1px solid rgba(33, 150, 243, 0.12)',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <strong>Controls:</strong>{' '}
          {viewMode === 'slice' && 'Use slider to navigate through slices | Play/Pause for animation'}
          {viewMode === 'volume' && 'Click and drag to rotate | Scroll or use slider to zoom'}
          {viewMode === 'mip' && 'Click and drag to rotate | Maximum Intensity Projection combines all slices'}
        </Typography>
      </Paper>
    </Box>
  );
};
