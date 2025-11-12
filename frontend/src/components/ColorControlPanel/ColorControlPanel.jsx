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
        p: { xs: 2.5, sm: 3, md: 3.5 },
        maxHeight: { xs: '400px', sm: '500px', md: '600px' },
        overflow: 'auto',
        borderRadius: 1,
        backgroundColor: '#0F1419',
        border: '2px solid #2D3748',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#1A202C',
          border: '1px solid #2D3748',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#4A5568',
          border: '1px solid #2D3748',
          '&:hover': {
            backgroundColor: '#718096',
          },
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 2.5 },
        pb: 1.5,
        borderBottom: '1px solid #2D3748'
      }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#E2E8F0',
          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        CHANNEL CONTROL
      </Typography>
        <Box sx={{
          px: 1.5,
          py: 0.5,
          backgroundColor: '#1A202C',
          border: '1px solid #2D3748',
          borderRadius: 0.5,
        }}>
          <Typography
            variant="caption"
            sx={{
              color: '#48BB78',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            [{adjustments.filter(a => a.enabled).length}/3]
          </Typography>
        </Box>
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
                border: '2px solid #2D3748',
                p: { xs: 1.5, sm: 2 },
                borderRadius: 0.5,
                background: '#1A202C',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#4A5568',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 8px rgba(66, 153, 225, 0.2)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: color.hex,
                    border: '2px solid #2D3748',
                    boxShadow: `0 0 8px ${color.hex}`,
                  }} />
                  <Typography
                    sx={{
                      color: '#E2E8F0',
                      fontFamily: 'monospace',
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {color.name}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={adjustment.enabled}
                      onChange={() => toggleColor(color.id)}
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: color.hex,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: color.hex,
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#2D3748',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: 'monospace',
                        color: adjustment.enabled ? '#48BB78' : '#718096',
                        fontWeight: 600,
                      }}
                    >
                      {adjustment.enabled ? 'ON' : 'OFF'}
                    </Typography>
                  }
                />
              </Box>
              {adjustment.enabled && (
                <Box sx={{ 
                  mt: 1.5, 
                  pt: 1.5,
                  borderTop: '1px solid #2D3748',
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1,
                    px: 1,
                    py: 0.5,
                    backgroundColor: '#0F1419',
                    border: '1px solid #2D3748',
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: '#A0AEC0', 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>
                      CONTRAST
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: color.hex,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}>
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
                      color: color.hex,
                      '& .MuiSlider-thumb': {
                        width: 16,
                        height: 16,
                        backgroundColor: color.hex,
                        border: '2px solid #2D3748',
                        boxShadow: `0 0 0 2px #0F1419, 0 0 8px ${color.hex}`,
                        '&:hover': {
                          boxShadow: `0 0 0 2px #0F1419, 0 0 12px ${color.hex}`,
                        },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: color.hex,
                        border: 'none',
                        height: 4,
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#2D3748',
                        height: 4,
                      },
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: '#0F1419',
                        border: `1px solid ${color.hex}`,
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
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

