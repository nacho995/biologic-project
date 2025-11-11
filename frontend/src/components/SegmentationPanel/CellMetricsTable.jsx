import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';

export const CellMetricsTable = ({ metrics }) => {
  if (!metrics || !metrics.metrics || metrics.metrics.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No cell metrics available. Run segmentation first.
        </Typography>
      </Paper>
    );
  }

  const cells = metrics.metrics;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cell Metrics ({cells.length} cells)
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Area</TableCell>
              <TableCell align="right">Perimeter</TableCell>
              <TableCell align="right">Circularity</TableCell>
              <TableCell align="right">Intensity</TableCell>
              <TableCell align="right">Aspect Ratio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cells.map((cell) => (
              <TableRow key={cell.id} hover>
                <TableCell>
                  <Chip label={cell.id} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">{cell.area.toLocaleString()}</TableCell>
                <TableCell align="right">{cell.perimeter.toFixed(1)}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={cell.circularity.toFixed(3)}
                    size="small"
                    color={cell.circularity > 0.8 ? 'success' : cell.circularity > 0.5 ? 'warning' : 'error'}
                  />
                </TableCell>
                <TableCell align="right">{cell.meanIntensity.toFixed(1)}</TableCell>
                <TableCell align="right">{cell.aspectRatio.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

