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
import { useZoom } from '../../hooks/useZoom.js';
import { usePan } from '../../hooks/usePan.js';
import { getSlice } from '../../services/api.js';

export const VolumetricViewer3D = () => {
  const { currentImageId, images } = useImageStore();
  const { colors } = useColorStore();
  const { zoom, setZoom, handleWheel, zoomIn, zoomOut, resetZoom } = useZoom();
  const { panX, panY, isDragging, startDrag, onDrag, endDrag, resetPan } = usePan();
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [sliceIndex, setSliceIndex] = useState(0);
  const [maxSlices, setMaxSlices] = useState(1);
  const [viewMode, setViewMode] = useState('volume');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [opacity, setOpacity] = useState(0.8);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  
  const [sliceImages, setSliceImages] = useState([]);
  const [imageInfo, setImageInfo] = useState(null);
  
  const isRotating = useRef(false);
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
    
    // Create a copy of the original data
    const originalData = new Uint8ClampedArray(data);
    
    // Calculate BLACK_THRESHOLD (25th percentile of grayscale values)
    const grayscaleValues = [];
    for (let i = 0; i < data.length; i += 4) {
      grayscaleValues.push(originalData[i]); // R channel (assuming grayscale)
    }
    grayscaleValues.sort((a, b) => a - b);
    const BLACK_THRESHOLD = grayscaleValues[Math.floor(grayscaleValues.length * 0.25)];
    
    const activeColors = colors && Array.isArray(colors) ? colors.filter(c => c.enabled) : [];
    const hasActiveColors = activeColors.length > 0;

    for (let i = 0; i < data.length; i += 4) {
      const grayValue = originalData[i];
      
      // Filter black background (make transparent)
      if (grayValue <= BLACK_THRESHOLD) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0; // Transparent
        continue;
      }
      
      if (hasActiveColors) {
        // Apply color mapping
        let r = 0, g = 0, b = 0;
        
        activeColors.forEach(color => {
          // Apply contrast adjustment
          const contrastFactor = (color.contrast || 100) / 100;
          const adjusted = Math.min(255, grayValue * contrastFactor);
          
          // Apply color mapping
          const rgb = hexToRgb(color.color);
          const intensity = adjusted / 255;
          
          r += intensity * rgb.r;
          g += intensity * rgb.g;
          b += intensity * rgb.b;
        });
        
        // Apply brightness and clamp values
        data[i] = Math.min(255, r * brightness);
        data[i + 1] = Math.min(255, g * brightness);
        data[i + 2] = Math.min(255, b * brightness);
        data[i + 3] = 255; // Opaque
      } else {
        // No colors active, keep grayscale with brightness
        data[i] = Math.min(255, grayValue * brightness);
        data[i + 1] = Math.min(255, grayValue * brightness);
        data[i + 2] = Math.min(255, grayValue * brightness);
        data[i + 3] = 255; // Opaque
      }
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
  }, [sliceImages, sliceIndex, viewMode, zoom, panX, panY, rotation, brightness, contrast, opacity, colors]);

  // Render single slice
  const renderSlice = (ctx, canvas) => {
    const img = sliceImages[sliceIndex];
    if (!img) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw to temporary canvas first
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    tempCtx.drawImage(img, 0, 0);
    
    // Apply color adjustments and black filtering
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const adjustedData = applyColorAdjustments(tempCtx, imageData);
    tempCtx.putImageData(adjustedData, 0, 0);
    
    // Draw adjusted image to main canvas with zoom and pan
    const scale = zoom;
    const w = tempCanvas.width * scale;
    const h = tempCanvas.height * scale;
    const x = (canvas.width - w) / 2 + panX;
    const y = (canvas.height - h) / 2 + panY;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, x, y, w, h);
    ctx.restore();
  };

  // Render Maximum Intensity Projection
  const renderMIP = (ctx, canvas) => {
    if (sliceImages.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create temporary canvas for MIP computation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sliceImages[0].width;
    tempCanvas.height = sliceImages[0].height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    // Initialize with first image
    tempCtx.drawImage(sliceImages[0], 0, 0);
    let mipData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Compute maximum intensity projection
    sliceImages.slice(1).forEach((img) => {
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        mipData.data[i] = Math.max(mipData.data[i], imageData.data[i]);
        mipData.data[i + 1] = Math.max(mipData.data[i + 1], imageData.data[i + 1]);
        mipData.data[i + 2] = Math.max(mipData.data[i + 2], imageData.data[i + 2]);
      }
    });
    
    // Apply color adjustments and black filtering
    const adjustedData = applyColorAdjustments(tempCtx, mipData);
    tempCtx.putImageData(adjustedData, 0, 0);
    
    // Draw to main canvas with zoom and pan
    const scale = zoom;
    const w = tempCanvas.width * scale;
    const h = tempCanvas.height * scale;
    const x = (canvas.width - w) / 2 + panX;
    const y = (canvas.height - h) / 2 + panY;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, x, y, w, h);
    ctx.restore();
  };

  // Render volume with alpha blending
  const renderVolume = (ctx, canvas) => {
    if (sliceImages.length === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create temporary canvas for compositing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sliceImages[0].width;
    tempCanvas.height = sliceImages[0].height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    const alphaPerSlice = opacity / sliceImages.length;
    
    // Composite all slices
    sliceImages.forEach((img) => {
      tempCtx.globalAlpha = alphaPerSlice * 2;
      tempCtx.drawImage(img, 0, 0);
    });
    
    // Apply color adjustments and black filtering
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const adjustedData = applyColorAdjustments(tempCtx, imageData);
    tempCtx.putImageData(adjustedData, 0, 0);
    
    // Draw to main canvas with zoom and pan
    const scale = zoom;
    const w = tempCanvas.width * scale;
    const h = tempCanvas.height * scale;
    const x = (canvas.width - w) / 2 + panX;
    const y = (canvas.height - h) / 2 + panY;
    
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, x, y, w, h);
    ctx.restore();
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

  // Mouse interaction for pan and rotation
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (e.shiftKey) {
      // Shift + drag = rotation (for volume/MIP modes)
      isRotating.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      // Normal drag = pan
      startDrag(x, y);
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isRotating.current) {
      // Handle rotation with Shift key
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
        z: prev.z,
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      // Handle panning
      onDrag(x, y);
    }
  };

  const handleMouseUp = () => {
    isRotating.current = false;
    endDrag();
  };
  
  const handleCanvasWheel = (e) => {
    e.preventDefault();
    handleWheel(e);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    resetZoom();
    resetPan();
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
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <ViewInAr sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
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
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack spacing={2}>
          {/* View Mode Selection */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              Rendering Mode
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'text.secondary',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                  },
                },
              }}
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleCanvasWheel}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: isDragging ? 'grabbing' : 'grab',
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
          backgroundColor: 'rgba(33, 150, 243, 0.08)',
          border: '1px solid rgba(33, 150, 243, 0.2)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>Controls:</Box>{' '}
          {viewMode === 'slice' && 'Use slider to navigate through slices | Play/Pause for animation'}
          {viewMode === 'volume' && 'Click and drag to rotate | Scroll or use slider to zoom'}
          {viewMode === 'mip' && 'Click and drag to rotate | Maximum Intensity Projection combines all slices'}
        </Typography>
      </Paper>
    </Box>
  );
};
