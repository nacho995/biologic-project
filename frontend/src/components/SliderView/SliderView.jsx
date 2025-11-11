import React, { useState } from 'react';
import { Box, Paper, IconButton, Typography, Slider } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useImageStore } from '../../store/imageStore.js';

export const SliderView = () => {
  const { images, currentImageId, setCurrentImage } = useImageStore();
  const currentIndex = images.findIndex((img) => img.id === currentImageId);
  const [localIndex, setLocalIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  const galleryItems = images.map((img) => ({
    original: img.path,
    thumbnail: img.thumbnail || img.path,
  }));

  const handleSlideChange = (index) => {
    setLocalIndex(index);
    if (images[index]) {
      setCurrentImage(images[index].id);
    }
  };

  const handlePrevious = () => {
    if (localIndex > 0) {
      handleSlideChange(localIndex - 1);
    }
  };

  const handleNext = () => {
    if (localIndex < images.length - 1) {
      handleSlideChange(localIndex + 1);
    }
  };

  if (images.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>No images available</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={handlePrevious} disabled={localIndex === 0}>
          <ChevronLeft />
        </IconButton>
        <Typography>
          Image {localIndex + 1} of {images.length}
        </Typography>
        <IconButton onClick={handleNext} disabled={localIndex === images.length - 1}>
          <ChevronRight />
        </IconButton>
      </Box>
      <Slider
        value={localIndex}
        min={0}
        max={Math.max(0, images.length - 1)}
        step={1}
        onChange={(_, value) => handleSlideChange(value)}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value + 1}`}
        sx={{ mb: 2 }}
      />
      {galleryItems.length > 0 && (
        <ImageGallery
          items={galleryItems}
          startIndex={localIndex}
          onSlide={handleSlideChange}
          showThumbnails={true}
          showFullscreenButton={false}
          showPlayButton={false}
        />
      )}
    </Box>
  );
};

