import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Slider,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  SkipPrevious,
  SkipNext,
  PlayArrow,
  Pause,
  ViewInAr,
  Layers,
  Height,
} from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';
import { getSlice } from '../../services/api.js';
import { useZoom } from '../../hooks/useZoom.js';
import { usePan } from '../../hooks/usePan.js';
import { useColorAdjustment } from '../../hooks/useColorAdjustment.js';

export const MultiDimensionalViewer = () => {
  const { currentImageId, images } = useImageStore();
  const { zoom, handleWheel } = useZoom();
  const { panX, panY, startDrag, onDrag, endDrag } = usePan();
  const { processedImageUrl } = useColorAdjustment();
  const imageRef = useRef(null);
  const [currentPlane, setCurrentPlane] = useState('z'); // x, y, z
  const [sliceIndex, setSliceIndex] = useState(0);
  const [maxSlices, setMaxSlices] = useState(1);
  const [sliceImageUrl, setSliceImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(200); // ms between frames
  const [imageInfo, setImageInfo] = useState(null);
  const [konvaImage, setKonvaImage] = useState(null);

  // Get current image info
  useEffect(() => {
    if (currentImageId && images.length > 0) {
      const img = images.find(i => i.id === currentImageId);
      if (img && img.dimensions) {
        setImageInfo(img.dimensions);
        // Set max slices based on current plane
        const max = currentPlane === 'z' ? (img.dimensions.depth || 1) :
                    currentPlane === 'y' ? (img.dimensions.height || 1) :
                    (img.dimensions.width || 1);
        setMaxSlices(max);
        setSliceIndex(Math.min(sliceIndex, max - 1));
      }
    }
  }, [currentImageId, images, currentPlane]);

  // Load slice when parameters change
  useEffect(() => {
    if (currentImageId) {
      loadSlice();
    }
  }, [currentImageId, currentPlane, sliceIndex]);

  // Load image for Konva when slice URL or processed URL changes
  useEffect(() => {
    const imageUrl = processedImageUrl || sliceImageUrl;
    if (!imageUrl) {
      setKonvaImage(null);
      return;
    }
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setKonvaImage(img);
    };
    
    img.onerror = (error) => {
      console.error('Error loading slice image:', error);
    };
    
    img.src = imageUrl;
    
    return () => {
      // Cleanup
    };
  }, [sliceImageUrl, processedImageUrl]);

  // Auto-play functionality
  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setSliceIndex(prev => {
        const next = prev + 1;
        return next >= maxSlices ? 0 : next;
      });
    }, playSpeed);

    return () => clearInterval(interval);
  }, [playing, maxSlices, playSpeed]);

  const loadSlice = async () => {
    if (!currentImageId) return;

    setLoading(true);
    try {
      const blob = await getSlice(currentImageId, currentPlane, sliceIndex);
      const url = URL.createObjectURL(blob);
      
      if (sliceImageUrl) {
        URL.revokeObjectURL(sliceImageUrl);
      }
      
      setSliceImageUrl(url);
    } catch (error) {
      console.error('Error loading slice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaneChange = (_event, newPlane) => {
    if (newPlane !== null) {
      setCurrentPlane(newPlane);
      setSliceIndex(0);
    }
  };

  const handleSliceChange = (_event, newValue) => {
    setSliceIndex(newValue);
  };

  const handlePrevSlice = () => {
    setSliceIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextSlice = () => {
    setSliceIndex(prev => Math.min(maxSlices - 1, prev + 1));
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    startDrag(pointerPos.x, pointerPos.y);
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    onDrag(pointerPos.x, pointerPos.y);
  };

  const handleMouseUp = () => {
    endDrag();
  };

  if (!currentImageId) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', minHeight: '400px' }}>
        <ViewInAr sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Image Selected
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Upload a multi-dimensional image (TIFF stack) to use this viewer
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Compact Controls Bar */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          pointerEvents: 'auto',
        }}
      >
        <Grid container spacing={2} alignItems="center">
            {/* Plane Selection */}
          <Grid item xs={12} sm={4}>
              <ToggleButtonGroup
                value={currentPlane}
                exclusive
                onChange={handlePlaneChange}
              size="small"
                fullWidth
            >
              <ToggleButton value="x">X</ToggleButton>
              <ToggleButton value="y">Y</ToggleButton>
              <ToggleButton value="z">Z</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

      {/* Playback Controls */}
          <Grid item xs={12} sm={8}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton size="small" onClick={handlePrevSlice} disabled={sliceIndex === 0}>
              <SkipPrevious />
            </IconButton>
              <IconButton size="small" onClick={togglePlay} color="primary">
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>
              <IconButton size="small" onClick={handleNextSlice} disabled={sliceIndex >= maxSlices - 1}>
              <SkipNext />
            </IconButton>
            <Box sx={{ flexGrow: 1, px: 2 }}>
              <Slider
                value={sliceIndex}
                min={0}
                max={maxSlices - 1}
                step={1}
                onChange={handleSliceChange}
                  size="small"
              />
            </Box>
              <Typography variant="caption" sx={{ minWidth: 60, textAlign: 'right' }}>
                {sliceIndex + 1}/{maxSlices}
            </Typography>
          </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Image Viewer Area */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          backgroundImage: 'none',
        }}
      >
        {loading && (
          <Box sx={{ textAlign: 'center' }}>
            <LinearProgress sx={{ mb: 2, width: 200 }} />
            <Typography variant="body2" color="text.secondary">
              Loading slice...
            </Typography>
          </Box>
        )}

        {!loading && konvaImage ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
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
                backgroundColor: 'transparent',
                cursor: 'grab',
              }}
            >
              <Layer clearBeforeDraw={true}>
                <KonvaImage
                  ref={imageRef}
                  image={konvaImage}
                  x={panX}
                  y={panY}
                  scaleX={zoom}
                  scaleY={zoom}
                />
              </Layer>
            </Stage>
          </Box>
        ) : !loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ViewInAr sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No 3D stack loaded
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

