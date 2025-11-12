import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert
} from '@mui/material';
import {
  Science,
  Assessment,
  Timeline,
  HighQuality,
  Biotech,
  Analytics
} from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';

export const AnalyticsDashboard = () => {
  const { currentImageId, images } = useImageStore();
  const [quantitativeData, setQuantitativeData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentImageId) {
      loadQuantitativeData(currentImageId);
    }
  }, [currentImageId]);

  const loadQuantitativeData = async (imageId) => {
    setLoading(true);
    try {
      const { getQuantitativeAnalysis } = await import('../../services/api.js');
      const response = await getQuantitativeAnalysis(imageId);
      
      if (response.status === 'success' && response.analysis) {
        setQuantitativeData(response.analysis);
      } else {
        console.warn('Unexpected response format:', response);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading quantitative data:', error);
      setLoading(false);
    }
  };

  if (!currentImageId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Analytics sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography color="text.secondary">
          Select an image to view quantitative analysis
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, minHeight: '400px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Assessment sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="text.primary">Loading Quantitative Analysis...</Typography>
        </Box>
        <LinearProgress />
      </Box>
    );
  }

  if (!quantitativeData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Analytics sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography color="text.secondary" gutterBottom>
          No quantitative data available for this image
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Try adjusting colors in the Color Control Panel to generate analysis
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', mb: 3 }}>
        <Analytics sx={{ mr: 1, color: 'primary.main' }} />
        Quantitative Analysis Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Métricas Celulares */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                <Biotech sx={{ mr: 1, color: 'primary.main' }} />
                Cellular Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Cells:</Typography>
                  <Chip
                    label={quantitativeData.cellularMetrics.totalCells.toLocaleString()}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Mean Intensity:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="text.primary">
                    {quantitativeData.cellularMetrics.meanIntensity.toFixed(2)}
                  </Typography>
                </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Signal-to-Noise Ratio:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {(quantitativeData.cellularMetrics?.signalToNoiseRatio || []).map(ratio =>
                          ratio.toFixed(1)
                        ).join(', ') || 'N/A'}
                      </Typography>
                    </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Métricas de Calidad */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                <HighQuality sx={{ mr: 1, color: 'primary.main' }} />
                Image Quality
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Focus Quality:</Typography>
                  <Chip
                    label={quantitativeData.qualityMetrics.focusQuality}
                    size="small"
                    color={
                      quantitativeData.qualityMetrics.focusQuality.includes('Excellent') ? 'success' :
                      quantitativeData.qualityMetrics.focusQuality.includes('Good') ? 'primary' :
                      quantitativeData.qualityMetrics.focusQuality.includes('Moderate') ? 'warning' : 'error'
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Background Uniformity:</Typography>
                  <Chip
                    label={quantitativeData.qualityMetrics.backgroundUniformity}
                    size="small"
                    color={
                      quantitativeData.qualityMetrics.backgroundUniformity.includes('Excellent') ? 'success' :
                      quantitativeData.qualityMetrics.backgroundUniformity.includes('Good') ? 'primary' :
                      quantitativeData.qualityMetrics.backgroundUniformity.includes('Moderate') ? 'warning' : 'error'
                    }
                  />
                </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Signal Uniformity (CV):</Typography>
                      <Typography variant="body2" fontWeight="bold" color="text.primary">
                        {(quantitativeData.qualityMetrics?.signalUniformity || []).map(cv =>
                          (cv * 100).toFixed(1) + '%'
                        ).join(', ') || 'N/A'}
                      </Typography>
                    </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Análisis por Canal */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                <Science sx={{ mr: 1, color: 'primary.main' }} />
                Channel Analysis
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Channel</TableCell>
                      <TableCell>Fluorophore</TableCell>
                      <TableCell>Mean ± SD</TableCell>
                      <TableCell>S/N Ratio</TableCell>
                      <TableCell>Dynamic Range</TableCell>
                      <TableCell>Color Applied</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(quantitativeData.channels || []).map((channel) => (
                      <TableRow key={channel.channelIndex}>
                        <TableCell>
                          <Chip label={`Ch ${channel.channelIndex}`} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {channel.fluorophore.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(channel.fluorophore.confidence * 100).toFixed(0)}% confidence
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {channel.statistics.mean.toFixed(1)} ± {channel.statistics.stdDev.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          {channel.statistics.signalToNoise.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {channel.statistics.dynamicRange}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={channel.colorApplied}
                            size="small"
                            sx={{
                              backgroundColor: channel.colorApplied === 'DAPI' ? '#0000FF' :
                                             channel.colorApplied === 'FITC/GFP' ? '#00FF00' : '#FF0000',
                              color: 'white'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Análisis de Colocalización */}
        {quantitativeData.channelCorrelations.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                  <Timeline sx={{ mr: 1, color: 'primary.main' }} />
                  Colocalization Analysis
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Pearson correlation coefficients measure the degree of colocalization between channels
                </Alert>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Channel Pair</TableCell>
                        <TableCell>Pearson r</TableCell>
                        <TableCell>Interpretation</TableCell>
                        <TableCell>Strength</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quantitativeData.channelCorrelations.map((corr, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            Ch{corr.channel1} ↔ Ch{corr.channel2}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {corr.pearsonCorrelation.toFixed(3)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {corr.interpretation}
                          </TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={Math.abs(corr.pearsonCorrelation) * 100}
                              sx={{
                                width: 80,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.300',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: Math.abs(corr.pearsonCorrelation) > 0.6 ? 'success.main' :
                                                 Math.abs(corr.pearsonCorrelation) > 0.3 ? 'warning.main' : 'error.main'
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Metadatos de Imagen */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Image Metadata
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Dimensions</Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {quantitativeData.imageMetadata.width} × {quantitativeData.imageMetadata.height}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Channels</Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {quantitativeData.imageMetadata.channels}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Format</Typography>
                  <Typography variant="body1" fontWeight="bold" color="text.primary">
                    {quantitativeData.imageMetadata.format}
                  </Typography>
                </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Active Channels</Typography>
                      <Typography variant="body1" fontWeight="bold" color="text.primary">
                        {(quantitativeData.channels || []).length}
                      </Typography>
                    </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
