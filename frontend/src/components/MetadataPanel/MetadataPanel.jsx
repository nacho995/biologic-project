import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from '@mui/material';
import { Search, Download } from '@mui/icons-material';
import { useMetadataStore } from '../../store/metadataStore.js';
import { useImageStore } from '../../store/imageStore.js';
import { getMetadata } from '../../services/api.js';

export const MetadataPanel = () => {
  const { currentImageMetadata, setCurrentImageMetadata } = useMetadataStore();
  const { currentImageId } = useImageStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentImageId) {
      getMetadata(currentImageId)
        .then((response) => {
          setCurrentImageMetadata(response.metadata || {});
        })
        .catch((error) => {
          console.error('Failed to load metadata:', error);
          // Set empty metadata on error (e.g., 404)
          setCurrentImageMetadata({});
        });
    }
  }, [currentImageId, setCurrentImageMetadata]);

  const filteredMetadata = currentImageMetadata
    ? Object.entries(currentImageMetadata).filter(([key, value]) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          key.toLowerCase().includes(searchLower) ||
          String(value).toLowerCase().includes(searchLower)
        );
      })
    : [];

  const handleExport = () => {
    if (!currentImageMetadata) return;
    const csv = [
      Object.keys(currentImageMetadata).join(','),
      Object.values(currentImageMetadata).join(','),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metadata-${currentImageId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, sm: 2.5 },
          pb: 1.5,
          borderBottom: '1px solid #2D3748',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
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
          DATA REGISTRY
        </Typography>
        <Button
          size="small"
          startIcon={<Download sx={{ fontSize: '0.875rem' }} />}
          onClick={handleExport}
          disabled={!currentImageMetadata}
          variant="outlined"
          sx={{
            borderColor: '#2D3748',
            color: '#E2E8F0',
            backgroundColor: '#1A202C',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            minWidth: 'auto',
            '&:hover': {
              borderColor: '#4299E1',
              backgroundColor: '#2D3748',
              boxShadow: '0 0 8px rgba(66, 153, 225, 0.3)',
            },
            '&:disabled': {
              borderColor: '#2D3748',
              color: '#4A5568',
              backgroundColor: '#1A202C',
            },
          }}
        >
          EXPORT
        </Button>
      </Box>
      <TextField
        fullWidth
        size="small"
        placeholder="SEARCH..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: '#718096', fontSize: '1rem' }} />,
          sx: {
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            color: '#E2E8F0',
          }
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1A202C',
            border: '2px solid #2D3748',
            borderRadius: 0.5,
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              borderColor: '#4A5568',
            },
            '&.Mui-focused': {
              borderColor: '#4299E1',
              boxShadow: '0 0 8px rgba(66, 153, 225, 0.3)',
            },
          },
          '& input::placeholder': {
            color: '#718096',
            opacity: 1,
          },
        }}
      />
      {currentImageMetadata ? (
        <TableContainer sx={{ 
          backgroundColor: '#1A202C',
          border: '2px solid #2D3748',
          borderRadius: 0.5,
        }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0F1419' }}>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#A0AEC0',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  borderBottom: '2px solid #2D3748',
                  py: 1,
                }}>
                  PARAMETER
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#A0AEC0',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  borderBottom: '2px solid #2D3748',
                  py: 1,
                }}>
                  VALUE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMetadata.map(([key, value], index) => (
                <TableRow 
                  key={key}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#1A202C' : '#0F1419',
                    '&:hover': {
                      backgroundColor: '#2D3748',
                    },
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#E2E8F0',
                    fontFamily: 'monospace',
                    fontSize: '0.8125rem',
                    borderBottom: '1px solid #2D3748',
                    py: 1.25,
                  }}>
                    {key}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#4299E1',
                    fontFamily: 'monospace',
                    fontSize: '0.8125rem',
                    borderBottom: '1px solid #2D3748',
                    py: 1.25,
                  }}>
                    {String(value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          backgroundColor: '#1A202C',
          border: '2px solid #2D3748',
          borderRadius: 0.5,
        }}>
          <Typography variant="body2" sx={{ 
            color: '#718096',
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
          }}>
            NO DATA AVAILABLE
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

