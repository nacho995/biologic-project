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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import {
  getAllImages,
  deleteImage,
  updateImage,
  getAllCsvUploads,
} from '../../services/api.js';
import { useCompositionStore } from '../../store/compositionStore.js';

export const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [csvUploads, setCsvUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, image: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, image: null });
  const [filterCsv, setFilterCsv] = useState('');
  const { addLayer } = useCompositionStore();

  useEffect(() => {
    loadImages();
    loadCsvUploads();
  }, [filterCsv]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const params = filterCsv ? { csvUploadId: filterCsv } : {};
      const data = await getAllImages(params);
      setImages(data.data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCsvUploads = async () => {
    try {
      const data = await getAllCsvUploads();
      setCsvUploads(data.data || []);
    } catch (error) {
      console.error('Error loading CSVs:', error);
    }
  };

  const handleAddToComposition = (imageId) => {
    addLayer(imageId);
  };

  const handleDelete = async () => {
    try {
      await deleteImage(deleteDialog.image.id);
      await loadImages();
      setDeleteDialog({ open: false, image: null });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading images...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Image Manager</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by CSV</InputLabel>
            <Select
              value={filterCsv}
              label="Filter by CSV"
              onChange={(e) => setFilterCsv(e.target.value)}
            >
              <MenuItem value="">All Images</MenuItem>
              {csvUploads.map((csv) => (
                <MenuItem key={csv.id} value={csv.id}>
                  {csv.filename}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`/api/images/${image.id}/thumbnail`}
                  alt={image.originalFilename}
                />
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {image.originalFilename}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleAddToComposition(image.id)}
                    title="Add to Composition"
                    color="primary"
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteDialog({ open: true, image })}
                    title="Delete"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, image: null })}
      >
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image?
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
    </Box>
  );
};

