import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import { Assessment, Calculate } from '@mui/icons-material';

export const StatisticalAnalysisPanel = () => {
  const [selectedTest, setSelectedTest] = useState('t-test-independent');
  const [group1, setGroup1] = useState([10, 12, 14, 15, 16, 18, 20]);
  const [group2, setGroup2] = useState([8, 9, 11, 12, 13, 14, 15]);
  const [results, setResults] = useState(null);

  const availableTests = [
    { id: 't-test-independent', name: 'Independent t-test' },
    { id: 't-test-paired', name: 'Paired t-test' },
    { id: 't-test-welch', name: "Welch's t-test" },
    { id: 'anova-one-way', name: 'One-way ANOVA' },
    { id: 'pearson-correlation', name: 'Pearson correlation' },
  ];

  const handleCalculate = () => {
    // En producción, esto llamaría al backend
    // Por ahora, simulamos resultados
    const mockResults = {
      test: 'Independent samples t-test',
      statistic: 2.45,
      pValue: 0.032,
      df: 12,
      mean1: 15.0,
      mean2: 11.7,
      significant: true,
      interpretation: 'Significant (p < 0.05)',
      effectSize: 0.85
    };
    setResults(mockResults);
  };

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
        <Assessment sx={{ mr: 1, color: '#1E3A5F' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Statistical Analysis
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Statistical Test</InputLabel>
        <Select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          label="Statistical Test"
        >
          {availableTests.map((test) => (
            <MenuItem key={test.id} value={test.id}>
              {test.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Alert severity="info" sx={{ mb: 3 }}>
        Select groups from your data to perform statistical analysis.
        In production, this would integrate with your quantitative analysis results.
      </Alert>

      <Button
        variant="contained"
        startIcon={<Calculate />}
        onClick={handleCalculate}
        fullWidth
        sx={{
          backgroundColor: '#1E3A5F',
          '&:hover': { backgroundColor: '#152A47' },
          mb: 3
        }}
      >
        Calculate
      </Button>

      {results && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Results
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell><strong>Test</strong></TableCell>
                  <TableCell>{results.test}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Statistic</strong></TableCell>
                  <TableCell>{results.statistic.toFixed(3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>P-value</strong></TableCell>
                  <TableCell>
                    <Chip
                      label={results.pValue.toFixed(3)}
                      color={results.significant ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Interpretation</strong></TableCell>
                  <TableCell>
                    <Chip
                      label={results.interpretation}
                      color={results.significant ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                {results.effectSize && (
                  <TableRow>
                    <TableCell><strong>Effect Size (Cohen's d)</strong></TableCell>
                    <TableCell>{results.effectSize.toFixed(2)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

