import React, { useCallback, useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, alpha, Snackbar, Alert } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { uploadImages } from '../../services/api.js';
import { useImageStore } from '../../store/imageStore.js';

export const FileUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { setImages, addImage, setCurrentImage } = useImageStore();

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
        setSnackbar({
          open: true,
          message: `Successfully uploaded ${result.images.length} image(s)!`,
          severity: 'success'
        });
      } catch (err) {
        console.error('Image upload error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        setSnackbar({
          open: true,
          message: `Error uploading images: ${errorMessage}`,
          severity: 'error'
        });
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
          color: 'text.primary',
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
          fullWidth
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.9375rem', sm: '1rem' },
            fontWeight: 700,
          }}
        >
          Upload TIFF Images
          <input
            type="file"
            accept="image/tiff,image/tif,.tif,.tiff"
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
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              Uploading...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
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
              backgroundColor: 'action.disabledBackground',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: 'primary.main',
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
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.15),
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: 2,
            transition: 'all 0.2s ease',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'error.light',
              fontWeight: 500,
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
          >
            {error}
          </Typography>
        </Box>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

