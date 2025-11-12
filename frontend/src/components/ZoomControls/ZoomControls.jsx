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
        gap: { xs: 2, sm: 2.5 },
        p: { xs: 2.5, sm: 3, md: 3.5 },
        borderRadius: 1,
        backgroundColor: '#0F1419',
        border: '2px solid #2D3748',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#E2E8F0',
          mb: 1.5,
          pb: 1.5,
          borderBottom: '1px solid #2D3748',
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        MAGNIFICATION
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 },
          backgroundColor: '#1A202C',
          border: '2px solid #2D3748',
          borderRadius: 0.5,
          mb: 1.5,
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#A0AEC0',
            fontWeight: 700,
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}
        >
          LEVEL
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.5,
        }}>
        <Typography
            variant="h4"
          sx={{
              color: '#4299E1',
            fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontFamily: 'monospace',
              textShadow: '0 0 8px rgba(66, 153, 225, 0.5)',
          }}
        >
            {(zoom * 100).toFixed(0)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#718096',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            %
        </Typography>
        </Box>
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
          startIcon={<ZoomOut sx={{ fontSize: '1.125rem' }} />}
          fullWidth={isMobile}
          sx={{
            flex: { xs: 'none', sm: 1 },
            borderColor: '#2D3748',
            backgroundColor: '#1A202C',
            color: '#E2E8F0',
            fontWeight: 700,
            fontFamily: 'monospace',
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            borderRadius: 0.5,
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#F56565',
              backgroundColor: '#2D3748',
              boxShadow: '0 0 8px rgba(245, 101, 101, 0.3)',
            },
            '&:active': {
              backgroundColor: '#0F1419',
            },
          }}
        >
          OUT
        </Button>
        <Button
          variant="outlined"
          onClick={resetZoom}
          startIcon={<FitScreen sx={{ fontSize: '1.125rem' }} />}
          fullWidth={isMobile}
          sx={{
            flex: { xs: 'none', sm: 1 },
            borderColor: '#2D3748',
            backgroundColor: '#1A202C',
            color: '#E2E8F0',
            fontWeight: 700,
            fontFamily: 'monospace',
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            borderRadius: 0.5,
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#F6E05E',
              backgroundColor: '#2D3748',
              boxShadow: '0 0 8px rgba(246, 224, 94, 0.3)',
            },
            '&:active': {
              backgroundColor: '#0F1419',
            },
          }}
        >
          RESET
        </Button>
        <Button
          variant="outlined"
          onClick={zoomIn}
          startIcon={<ZoomIn sx={{ fontSize: '1.125rem' }} />}
          fullWidth={isMobile}
          sx={{
            flex: { xs: 'none', sm: 1 },
            borderColor: '#2D3748',
            backgroundColor: '#1A202C',
            color: '#E2E8F0',
            fontWeight: 700,
            fontFamily: 'monospace',
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            borderRadius: 0.5,
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#48BB78',
              backgroundColor: '#2D3748',
              boxShadow: '0 0 8px rgba(72, 187, 120, 0.3)',
            },
            '&:active': {
              backgroundColor: '#0F1419',
            },
          }}
        >
          IN
        </Button>
      </Box>
      <Box sx={{
        p: 2,
        backgroundColor: '#1A202C',
        border: '2px solid #2D3748',
        borderRadius: 0.5,
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
      }}>
      <Slider
        value={zoom}
        min={0.1}
        max={10}
        step={0.1}
        onChange={(_, value) => setZoom(value)}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
        sx={{
            color: '#4299E1',
          '& .MuiSlider-thumb': {
              width: { xs: 16, sm: 18 },
              height: { xs: 16, sm: 18 },
              backgroundColor: '#4299E1',
              border: '2px solid #2D3748',
              boxShadow: '0 0 0 2px #0F1419, 0 0 12px rgba(66, 153, 225, 0.5)',
              transition: 'all 0.15s ease',
            '&:hover': {
                boxShadow: '0 0 0 2px #0F1419, 0 0 16px rgba(66, 153, 225, 0.8)',
                transform: 'scale(1.15)',
            },
          },
          '& .MuiSlider-track': {
              backgroundColor: '#4299E1',
              height: { xs: 3, sm: 4 },
              border: 'none',
              boxShadow: '0 0 8px rgba(66, 153, 225, 0.4)',
          },
          '& .MuiSlider-rail': {
              backgroundColor: '#2D3748',
              height: { xs: 3, sm: 4 },
          },
          '& .MuiSlider-valueLabel': {
              backgroundColor: '#0F1419',
              border: '1px solid #4299E1',
              fontFamily: 'monospace',
              fontSize: { xs: '0.6875rem', sm: '0.75rem' },
              fontWeight: 700,
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#2D3748',
              width: 2,
              height: 8,
            },
            '& .MuiSlider-markActive': {
              backgroundColor: '#4299E1',
          },
        }}
          marks={[
            { value: 1, label: '' },
            { value: 2, label: '' },
            { value: 5, label: '' },
          ]}
      />
      </Box>
    </Box>
  );
};
