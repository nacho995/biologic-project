import React from 'react';
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useImageStore } from '../../store/imageStore.js';
import { ImageViewer } from '../ImageViewer/ImageViewer.jsx';

export const MultiDimensionalViewer = () => {
  const { viewState, updateViewState } = useImageStore();

  const handlePlaneChange = (_event, newPlane) => {
    if (newPlane !== null) {
      updateViewState({ currentPlane: newPlane });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle1">Plane:</Typography>
        <ToggleButtonGroup
          value={viewState.currentPlane}
          exclusive
          onChange={handlePlaneChange}
          aria-label="plane selection"
        >
          <ToggleButton value="x" aria-label="x plane">
            X
          </ToggleButton>
          <ToggleButton value="y" aria-label="y plane">
            Y
          </ToggleButton>
          <ToggleButton value="z" aria-label="z plane">
            Z
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="body2" color="textSecondary">
          Index: {viewState.planeIndex}
        </Typography>
      </Box>
      <Paper sx={{ p: 2 }}>
        <ImageViewer />
      </Paper>
    </Box>
  );
};

