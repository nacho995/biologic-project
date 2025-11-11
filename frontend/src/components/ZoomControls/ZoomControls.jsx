import React from 'react';
import { Box, Button, Typography, Slider, useMediaQuery, useTheme } from '@mui/material';
import { ZoomIn, ZoomOut, FitScreen } from '@mui/icons-material';
import { useZoom } from '../../hooks/useZoom.js';

export const ZoomControls = () => {
  const { zoom, zoomIn, zoomOut, setZoom, resetZoom } = useZoom();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3 },
        p: { xs: 2.5, sm: 3, md: 4 },
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#1A202C',
          mb: 0.5,
          fontSize: { xs: '1rem', sm: '1.125rem' },
          letterSpacing: '-0.01em',
        }}
      >
        Zoom Controls
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 },
          backgroundColor: '#F9FAFB',
          borderRadius: 1.5,
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#6B7280',
            fontWeight: 500,
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
          }}
        >
          Current Zoom
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#1E3A5F',
            fontWeight: 700,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
          }}
        >
          {(zoom * 100).toFixed(0)}%
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 1.5 },
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          variant="outlined"
          onClick={zoomOut}
          startIcon={<ZoomOut />}
          fullWidth={isMobile}
          sx={{
            flex: { xs: 'none', sm: 1 },
            borderColor: '#E5E7EB',
            color: '#1A202C',
            fontWeight: 500,
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: '#1E3A5F',
              backgroundColor: '#F9FAFB',
              borderWidth: '1.5px',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Zoom Out
        </Button>
        <Button
          variant="outlined"
          onClick={resetZoom}
          startIcon={<FitScreen />}
          fullWidth={isMobile}
          sx={{
            flex: { xs: 'none', sm: 1 },
            borderColor: '#E5E7EB',
            color: '#1A202C',
            fontWeight: 500,
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: '#1E3A5F',
              backgroundColor: '#F9FAFB',
              borderWidth: '1.5px',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          onClick={zoomIn}
          startIcon={<ZoomIn />}
          fullWidth={isMobile}
          sx={{
            flex: { xs: 'none', sm: 1 },
            borderColor: '#E5E7EB',
            color: '#1A202C',
            fontWeight: 500,
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: '#1E3A5F',
              backgroundColor: '#F9FAFB',
              borderWidth: '1.5px',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Zoom In
        </Button>
      </Box>
      <Slider
        value={zoom}
        min={0.1}
        max={10}
        step={0.1}
        onChange={(_, value) => setZoom(value)}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
        sx={{
          mt: { xs: 1, sm: 2 },
          '& .MuiSlider-thumb': {
            width: { xs: 18, sm: 20 },
            height: { xs: 18, sm: 20 },
            backgroundColor: '#1E3A5F',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(30, 58, 95, 0.3)',
              transform: 'scale(1.1)',
            },
          },
          '& .MuiSlider-track': {
            backgroundColor: '#1E3A5F',
            height: { xs: 4, sm: 6 },
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#E5E7EB',
            height: { xs: 4, sm: 6 },
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: '#1E3A5F',
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
          },
        }}
      />
    </Box>
  );
};
