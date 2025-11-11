import React, { useState, useEffect } from 'react';
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { Delete, Edit, Visibility, Download } from '@mui/icons-material';
import {
  getAllCsvUploads,
  deleteCsvUpload,
  updateCsvUpload,
} from '../../services/api.js';

export const CSVManager = () => {
  const [csvUploads, setCsvUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, csv: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, csv: null });
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadCsvUploads();
  }, []);

  const loadCsvUploads = async () => {
    setLoading(true);
    try {
      const data = await getAllCsvUploads();
      setCsvUploads(data.data || []);
    } catch (error) {
      console.error('Error loading CSVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (csv) => {
    setEditName(csv.filename);
    setEditDialog({ open: true, csv });
  };

  const handleSaveEdit = async () => {
    try {
      await updateCsvUpload(editDialog.csv.id, { filename: editName });
      await loadCsvUploads();
      setEditDialog({ open: false, csv: null });
    } catch (error) {
      console.error('Error updating CSV:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCsvUpload(deleteDialog.csv.id);
      await loadCsvUploads();
      setDeleteDialog({ open: false, csv: null });
    } catch (error) {
      console.error('Error deleting CSV:', error);
    }
  };

  if (loading) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          border: '1px solid #DEE2E6',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body1" sx={{ color: '#6C757D' }}>
          Loading CSVs...
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          border: '1px solid #DEE2E6',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#212529' }}>
            CSV Uploads
          </Typography>
          <Button
            variant="contained"
            onClick={loadCsvUploads}
            sx={{
              backgroundColor: '#1E3A5F',
              '&:hover': {
                backgroundColor: '#2C5282',
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Records</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {csvUploads.map((csv) => (
                <TableRow key={csv.id}>
                  <TableCell>{csv.filename}</TableCell>
                  <TableCell>
                    <Chip
                      label={csv.recordCount}
                      size="small"
                      sx={{
                        backgroundColor: '#E3F2FD',
                        color: '#1E3A5F',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={csv.imagesCount || 0}
                      size="small"
                      sx={{
                        backgroundColor: '#E8F5E9',
                        color: '#28A745',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(csv.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(csv)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteDialog({ open: true, csv })}
                      title="Delete"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, csv: null })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid #DEE2E6',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#212529', pb: 1 }}>
          Edit CSV
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Filename"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mt: 2 }}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setEditDialog({ open: false, csv: null })}
            sx={{ color: '#6C757D' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: '#1E3A5F',
              '&:hover': {
                backgroundColor: '#2C5282',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, csv: null })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: '1px solid #DEE2E6',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#212529', pb: 1 }}>
          Delete CSV
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#212529' }}>
            Are you sure you want to delete <strong>"{deleteDialog.csv?.filename}"</strong>? This will also delete all associated images.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, csv: null })}
            sx={{ color: '#6C757D' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: '#DC3545',
              '&:hover': {
                backgroundColor: '#C82333',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

