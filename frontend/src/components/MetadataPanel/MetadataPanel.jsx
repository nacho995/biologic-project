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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, sm: 3 },
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1A202C',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            letterSpacing: '-0.01em',
          }}
        >
          Metadata
        </Typography>
        <Button
          size="small"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={!currentImageMetadata}
          variant="outlined"
          sx={{
            borderColor: '#DEE2E6',
            color: '#212529',
            '&:hover': {
              borderColor: '#1E3A5F',
              backgroundColor: '#F8F9FA',
            },
            '&:disabled': {
              borderColor: '#E9ECEF',
              color: '#ADB5BD',
            },
          }}
        >
          Export
        </Button>
      </Box>
      <TextField
        fullWidth
        size="small"
        placeholder="Search metadata..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: '#6C757D' }} />,
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#3498DB',
            },
          },
        }}
      />
      {currentImageMetadata ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#212529' }}>Field</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#212529' }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMetadata.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 500, color: '#212529', borderBottom: '1px solid #DEE2E6' }}>
                    {key}
                  </TableCell>
                  <TableCell sx={{ color: '#6C757D', borderBottom: '1px solid #DEE2E6' }}>
                    {String(value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#6C757D' }}>
            No metadata available
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

