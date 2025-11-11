import React, { useCallback, useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { uploadCSV, uploadImages, getAllCsvUploads } from '../../services/api.js';
import { useImageStore } from '../../store/imageStore.js';

export const FileUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { setImages, addImage, setCurrentImage } = useImageStore();

  const handleCSVUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('csv', file);
        const response = await fetch('/api/csv-uploads', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          let errorMessage = errorData.error || `Upload failed: ${response.status}`;
          
          // Add details if available
          if (errorData.details) {
            errorMessage += `\n${errorData.details}`;
          }
          
          // Add columns info if validation failed
          if (errorData.columns && errorData.columns.length > 0) {
            errorMessage += `\n\nYour CSV has these columns:\n- ${errorData.columns.join('\n- ')}`;
            errorMessage += `\n\nRequired: A column named 'image_path'`;
          }
          
          throw new Error(errorMessage);
        }
        
        const result = await response.json();
        setProgress(100);
        // Reload images from the new CSV
        if (result.id) {
          const csvData = await getAllCsvUploads();
          // The images will be loaded separately
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        console.error('CSV upload error:', err);
      } finally {
        setUploading(false);
      }
    },
    [setImages]
  );

  const handleImageUpload = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      console.log(`Uploading ${files.length} files...`);
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const result = await uploadImages(files);
        console.log('Upload result:', result);
        setProgress(100);
        
        // Add uploaded images to store and select the first one
        const uploadedImages = result.images.map((img) => ({
          id: img.id,
          path: `/api/images/${img.id}`,
          thumbnail: `/api/images/${img.id}/thumbnail`,
          metadata: {},
          dimensions: img.dimensions,
          originalFilename: img.originalName,
        }));
        
        console.log('Uploaded images data:', uploadedImages);
        
        // Add each image to the store
        uploadedImages.forEach((imageData) => {
          addImage(imageData);
        });
        
        // Select the first uploaded image
        if (uploadedImages.length > 0) {
          const firstImage = uploadedImages[0];
          console.log('Setting current image to:', firstImage.id);
          setCurrentImage(firstImage.id);
        }
        console.log(`Successfully uploaded ${result.images.length} images`);
        alert(`Successfully uploaded ${result.images.length} image(s)!`);
      } catch (err) {
        console.error('Image upload error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        alert(`Error uploading images: ${errorMessage}`); // Temporary alert for debugging
      } finally {
        setUploading(false);
      }
    },
    [addImage]
  );

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: { xs: 2, sm: 3 },
          fontWeight: 700,
          color: '#1A202C',
          letterSpacing: '-0.01em',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
        }}
      >
        File Upload
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1.5, sm: 2 },
          flexWrap: 'wrap',
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          disabled={uploading}
          size="large"
          fullWidth={{ xs: true, sm: false }}
          sx={{
            backgroundColor: '#1E3A5F',
            px: { xs: 2, sm: 3 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#2C5282',
              transform: 'translateY(-1px)',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              backgroundColor: '#9CA3AF',
              cursor: 'not-allowed',
            },
          }}
        >
          Upload CSV
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleCSVUpload}
          />
        </Button>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          disabled={uploading}
          size="large"
          fullWidth={{ xs: true, sm: false }}
          sx={{
            backgroundColor: '#1E3A5F',
            px: { xs: 2, sm: 3 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#2C5282',
              transform: 'translateY(-1px)',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              backgroundColor: '#9CA3AF',
              cursor: 'not-allowed',
            },
          }}
        >
          Upload Images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#4A5568',
                fontWeight: 500,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              Uploading...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#1E3A5F',
                fontWeight: 600,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: { xs: 6, sm: 8 },
              borderRadius: 2,
              backgroundColor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: '#3498DB',
                transition: 'transform 0.3s ease',
              },
            }}
          />
        </Box>
      )}
      {error && (
        <Box
          sx={{
            mt: 2,
            p: { xs: 1.5, sm: 2 },
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 2,
            transition: 'all 0.2s ease',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#DC2626',
              fontWeight: 500,
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
          >
            {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

