import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { Delete, Add, Visibility } from '@mui/icons-material';
import { getAllImages, deleteImage } from '../../services/api.js';
import { useCompositionStore } from '../../store/compositionStore.js';
import { useImageStore } from '../../store/imageStore.js';

export const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, image: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addLayer } = useCompositionStore();
  const { setCurrentImage, setImages: setStoreImages } = useImageStore();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getAllImages();
      const imagesList = data.data || [];
      setImages(imagesList);
      
      // Sync with global store
      const formattedImages = imagesList.map(img => ({
        id: img.id,
        path: `/api/images/${img.id}`,
        thumbnail: `/api/images/${img.id}/thumbnail`,
        metadata: img.metadata || {},
        dimensions: img.dimensions || {},
        originalFilename: img.originalFilename,
        fileSize: img.fileSize,
        uploadDate: img.uploadDate,
      }));
      setStoreImages(formattedImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (imageId) => {
    setCurrentImage(imageId);
  };

  const handleAddToComposition = (imageId, imageName) => {
    addLayer(imageId);
    setSnackbar({
      open: true,
      message: `"${imageName}" added to composition! Go to "Composition" tab to see it overlaid.`,
      severity: 'success'
    });
  };

  const handleDelete = async () => {
    try {
      await deleteImage(deleteDialog.image.id);
      await loadImages();
      setDeleteDialog({ open: false, image: null });
      setSnackbar({
        open: true,
        message: 'Image deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbar({
        open: true,
        message: `Error deleting image: ${error.message}`,
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading images...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
        Image Manager
      </Typography>

      {images.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No images available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload TIFF images to get started
          </Typography>
        </Paper>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600}>
              💡 To overlay cell images:
            </Typography>
            <Typography variant="body2">
              1. Click the <strong>+ button</strong> to add images to composition<br />
              2. Go to <strong>"Composition"</strong> tab to see them overlaid<br />
              3. Adjust opacity and blend modes in the side panel
            </Typography>
          </Alert>

        <Grid container spacing={2}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    position: 'relative',
                    zIndex: 10,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                      zIndex: 20,
                    },
                  }}
                >
                <CardMedia
                  component="img"
                    height="180"
                  image={`/api/images/${image.id}/thumbnail`}
                  alt={image.originalFilename}
                    sx={{
                      objectFit: 'contain',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                    }}
                />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body2" 
                      noWrap 
                      fontWeight={600}
                      title={image.originalFilename}
                    >
                    {image.originalFilename}
                  </Typography>
                </CardContent>
                  <CardActions 
                    sx={{ 
                      justifyContent: 'space-between', 
                      px: 2, 
                      pb: 2,
                      pt: 0,
                      position: 'relative',
                      zIndex: 100,
                    }}
                  >
                  <IconButton
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectImage(image.id);
                      }}
                      title="View Image"
                      sx={{ 
                        color: 'primary.main',
                        zIndex: 101,
                        pointerEvents: 'auto',
                        '&:hover': { 
                          backgroundColor: 'primary.light',
                          transform: 'scale(1.2)',
                        },
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 1, zIndex: 101 }}>
                      <IconButton
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToComposition(image.id, image.originalFilename);
                        }}
                    title="Add to Composition"
                        sx={{
                          color: 'secondary.main',
                          border: '2px solid',
                          borderColor: 'secondary.main',
                          zIndex: 102,
                          pointerEvents: 'auto',
                          '&:hover': {
                            backgroundColor: 'secondary.light',
                            transform: 'scale(1.2)',
                          },
                        }}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialog({ open: true, image });
                        }}
                        title="Delete Image"
                        sx={{
                          color: 'error.main',
                          zIndex: 102,
                          pointerEvents: 'auto',
                          '&:hover': { 
                            backgroundColor: 'error.light',
                            transform: 'scale(1.2)',
                          },
                        }}
                  >
                    <Delete />
                  </IconButton>
                    </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        </>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, image: null })}
      >
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.image?.originalFilename}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, image: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
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
