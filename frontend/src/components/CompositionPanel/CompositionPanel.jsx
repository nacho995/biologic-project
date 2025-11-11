import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  ArrowUpward,
  ArrowDownward,
  Visibility,
  VisibilityOff,
  Save,
} from '@mui/icons-material';
import { useCompositionStore, BLEND_MODES } from '../../store/compositionStore.js';
import { COLOR_PALETTE } from '../../types/image.types.js';
import { createComposition, updateComposition } from '../../services/api.js';

export const CompositionPanel = () => {
  const {
    layers,
    compositionName,
    compositionDescription,
    currentCompositionId,
    removeLayer,
    updateLayer,
    toggleLayerVisibility,
    moveLayerUp,
    moveLayerDown,
    getSortedLayers,
    clearComposition,
    setComposition,
  } = useCompositionStore();

  const [saveDialog, setSaveDialog] = React.useState(false);
  const [name, setName] = React.useState(compositionName);
  const [description, setDescription] = React.useState(compositionDescription);

  const sortedLayers = getSortedLayers();

  const handleSave = async () => {
    try {
      const data = {
        name: name || 'Untitled Composition',
        description: description || '',
        layers: sortedLayers,
      };

      if (currentCompositionId) {
        await updateComposition(currentCompositionId, data);
      } else {
        const result = await createComposition(data);
        setComposition(result);
      }
      setSaveDialog(false);
    } catch (error) {
      console.error('Error saving composition:', error);
    }
  };

  const getColorName = (colorId) => {
    const color = COLOR_PALETTE.find((c) => c.id === colorId);
    return color ? color.name : 'Unknown';
  };

  const getColorHex = (colorId) => {
    const color = COLOR_PALETTE.find((c) => c.id === colorId);
    return color ? color.hex : '#000000';
  };

  return (
    <Paper sx={{ p: 2, maxHeight: '600px', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Composition Layers</Typography>
        <Button
          size="small"
          startIcon={<Save />}
          onClick={() => setSaveDialog(true)}
          variant="outlined"
        >
          Save
        </Button>
      </Box>

      {sortedLayers.length === 0 ? (
        <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
          No layers. Add images from Image Manager.
        </Typography>
      ) : (
        <List>
          {sortedLayers.map((layer, index) => (
            <ListItem
              key={layer.id}
              sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                mb: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={getColorName(layer.colorId)}
                  size="small"
                  sx={{
                    backgroundColor: getColorHex(layer.colorId),
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                />
                <Typography variant="caption" sx={{ flexGrow: 1 }}>
                  Layer {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleLayerVisibility(layer.id)}
                  title={layer.visible ? 'Hide' : 'Show'}
                >
                  {layer.visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveLayerUp(layer.id)}
                  disabled={index === sortedLayers.length - 1}
                  title="Move Up"
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveLayerDown(layer.id)}
                  disabled={index === 0}
                  title="Move Down"
                >
                  <ArrowDownward />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => removeLayer(layer.id)}
                  color="error"
                  title="Remove"
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">Opacity: {layer.opacity}%</Typography>
                <Slider
                  value={layer.opacity}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(_, value) =>
                    updateLayer(layer.id, { opacity: value })
                  }
                  size="small"
                />
              </Box>

              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel>Blend Mode</InputLabel>
                <Select
                  value={layer.blendMode}
                  label="Blend Mode"
                  onChange={(e) =>
                    updateLayer(layer.id, { blendMode: e.target.value })
                  }
                >
                  {BLEND_MODES.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel>Color</InputLabel>
                <Select
                  value={layer.colorId}
                  label="Color"
                  onChange={(e) =>
                    updateLayer(layer.id, { colorId: e.target.value })
                  }
                >
                  {COLOR_PALETTE.map((color) => (
                    <MenuItem key={color.id} value={color.id}>
                      {color.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          ))}
        </List>
      )}

      {/* Save Dialog */}
      <Dialog open={saveDialog} onClose={() => setSaveDialog(false)}>
        <DialogTitle>Save Composition</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

