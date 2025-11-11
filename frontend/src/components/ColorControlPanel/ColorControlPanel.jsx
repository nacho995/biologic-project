import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { useColorStore } from '../../store/colorStore.js';
import { COLOR_PALETTE } from '../../types/image.types.js';
import { ChannelSelector } from './ChannelSelector.jsx';

export const ColorControlPanel = () => {
  const { adjustments, toggleColor, setContrast } = useColorStore();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3, md: 4 },
        maxHeight: { xs: '400px', sm: '500px', md: '600px' },
        overflow: 'auto',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1A202C',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            letterSpacing: '-0.01em',
          }}
        >
          Color Controls
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          {adjustments.filter(a => a.enabled).length} active
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        {COLOR_PALETTE.map((color) => {
          const adjustment = adjustments.find((adj) => adj.colorId === color.id);
          if (!adjustment) return null;

          return (
            <Paper
              key={color.id}
              elevation={0}
              sx={{
                border: '1px solid #E5E7EB',
                p: { xs: 2, sm: 2.5 },
                borderRadius: 1.5,
                backgroundColor: '#FAFBFC',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: '#D1D5DB',
                  transform: 'translateY(-1px)',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip
                  label={color.name}
                  sx={{
                    backgroundColor: color.hex,
                    color: '#fff',
                    fontWeight: 600,
                    minWidth: 80,
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={adjustment.enabled}
                      onChange={() => toggleColor(color.id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#1E3A5F',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#1E3A5F',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: adjustment.enabled ? 600 : 400 }}>
                      {adjustment.enabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                  }
                />
              </Box>
              {adjustment.enabled && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#6C757D', fontWeight: 500 }}>
                      Contrast
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#212529', fontWeight: 600 }}>
                      {adjustment.contrast}%
                    </Typography>
                  </Box>
                  <Slider
                    value={adjustment.contrast}
                    min={50}
                    max={150}
                    step={1}
                    onChange={(_, value) => setContrast(color.id, value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#1E3A5F',
                        '&:hover': {
                          boxShadow: '0px 0px 0px 8px rgba(30, 58, 95, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#1E3A5F',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#E9ECEF',
                      },
                    }}
                  />
                  <ChannelSelector 
                    colorId={color.id} 
                    currentChannel={adjustment.channel} 
                  />
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};

