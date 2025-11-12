import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Snackbar
} from '@mui/material';
import {
  Science,
  PlayArrow,
  Download,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';
import { getAvailableMLModels, segmentCells, getSegmentationMetrics } from '../../services/api.js';

export const SegmentationPanel = () => {
  const { currentImageId } = useImageStore();
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('cellpose');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [segmentationMask, setSegmentationMask] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [params, setParams] = useState({
    diameter: 30,
    flow_threshold: 0.4,
    cellprob_threshold: 0.0
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await getAvailableMLModels();
      if (response.status === 'success') {
        setModels(response.models);
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handleSegment = async () => {
    if (!currentImageId) {
      setSnackbar({
        open: true,
        message: 'Please select an image first',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      // Realizar segmentación
      const maskBlob = await segmentCells(currentImageId, selectedModel, params);
      const maskUrl = URL.createObjectURL(maskBlob);
      setSegmentationMask(maskUrl);

      // Obtener métricas
      const metricsResponse = await getSegmentationMetrics(currentImageId, selectedModel, params);
      if (metricsResponse.status === 'success') {
        setMetrics(metricsResponse);
      }
      
      setSnackbar({
        open: true,
        message: 'Segmentation completed successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error segmenting cells:', error);
      setSnackbar({
        open: true,
        message: 'Error performing segmentation. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (paramName, value) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const selectedModelInfo = models.find(m => m.id === selectedModel);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Science sx={{ mr: 1, color: '#1E3A5F' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ML Cell Segmentation
        </Typography>
      </Box>

      {!currentImageId && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please select an image to segment
        </Alert>
      )}

      {/* Model Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>ML Model</InputLabel>
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          label="ML Model"
        >
          {models.map((model) => (
            <MenuItem key={model.id} value={model.id}>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {model.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {model.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedModelInfo && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Supports: {selectedModelInfo.supports.join(', ')}
          </Typography>
        </Box>
      )}

      {/* Parameters */}
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Parameters
      </Typography>

      {selectedModel === 'cellpose' && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Diameter: {params.diameter} pixels
            </Typography>
            <Slider
              value={params.diameter}
              min={10}
              max={100}
              step={5}
              onChange={(_, value) => handleParamChange('diameter', value)}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Flow Threshold: {params.flow_threshold.toFixed(2)}
            </Typography>
            <Slider
              value={params.flow_threshold}
              min={0}
              max={1}
              step={0.1}
              onChange={(_, value) => handleParamChange('flow_threshold', value)}
              valueLabelDisplay="auto"
            />
          </Box>
        </>
      )}

      {selectedModel === 'stardist' && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Probability Threshold: {params.prob_thresh?.toFixed(2) || 0.5}
            </Typography>
            <Slider
              value={params.prob_thresh || 0.5}
              min={0}
              max={1}
              step={0.05}
              onChange={(_, value) => handleParamChange('prob_thresh', value)}
              valueLabelDisplay="auto"
            />
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
          onClick={handleSegment}
          disabled={!currentImageId || loading}
          fullWidth
          sx={{
            backgroundColor: '#1E3A5F',
            '&:hover': { backgroundColor: '#152A47' }
          }}
        >
          {loading ? 'Segmenting...' : 'Segment Cells'}
        </Button>
      </Box>

      {/* Results */}
      {segmentationMask && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Results
            </Typography>
            <Button
              size="small"
              startIcon={showOverlay ? <VisibilityOff /> : <Visibility />}
              onClick={() => setShowOverlay(!showOverlay)}
            >
              {showOverlay ? 'Hide' : 'Show'} Overlay
            </Button>
          </Box>

          {metrics && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`${metrics.metadata?.totalCells || 0} cells detected`}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`Model: ${metrics.metadata?.model || selectedModel}`}
                variant="outlined"
              />
            </Box>
          )}

          {showOverlay && (
            <Box
              component="img"
              src={segmentationMask}
              alt="Segmentation mask"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 1,
                border: '1px solid #E5E7EB'
              }}
            />
          )}
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
    </Paper>
  );
};

