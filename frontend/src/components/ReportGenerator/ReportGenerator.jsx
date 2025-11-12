import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import { PictureAsPdf, Download, Preview } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ReportGenerator = () => {
  const [sections, setSections] = useState({
    cover: true,
    executiveSummary: true,
    methodology: true,
    results: true,
    statistics: true,
    appendices: false
  });
  const [generating, setGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSectionToggle = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Cover Page
      if (sections.cover) {
        doc.setFontSize(24);
        doc.text('Biological Image Analysis Report', 105, yPos, { align: 'center' });
        yPos += 20;
        doc.setFontSize(12);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
        doc.addPage();
        yPos = 20;
      }

      // Executive Summary
      if (sections.executiveSummary) {
        doc.setFontSize(16);
        doc.text('Executive Summary', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text('This report contains quantitative analysis of biological images...', 20, yPos);
        yPos += 10;
      }

      // Results Section
      if (sections.results) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(16);
        doc.text('Results', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text('Quantitative analysis results would be included here...', 20, yPos);
        yPos += 10;
      }

      // Statistics Section
      if (sections.statistics) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(16);
        doc.text('Statistical Analysis', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text('Statistical test results would be included here...', 20, yPos);
      }

      // Save PDF
      doc.save('biological_analysis_report.pdf');
      
      setSnackbar({
        open: true,
        message: 'PDF report generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Error generating PDF. Please try again.',
        severity: 'error'
      });
    } finally {
      setGenerating(false);
    }
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
        <PictureAsPdf sx={{ mr: 1, color: '#1E3A5F' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Generate Scientific Report
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Select sections to include in your report. The report will include all
        quantitative analysis results, statistical tests, and visualizations.
      </Alert>

      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
        Report Sections
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={sections.cover}
              onChange={() => handleSectionToggle('cover')}
            />
          }
          label="Cover Page"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sections.executiveSummary}
              onChange={() => handleSectionToggle('executiveSummary')}
            />
          }
          label="Executive Summary"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sections.methodology}
              onChange={() => handleSectionToggle('methodology')}
            />
          }
          label="Methodology"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sections.results}
              onChange={() => handleSectionToggle('results')}
            />
          }
          label="Results"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sections.statistics}
              onChange={() => handleSectionToggle('statistics')}
            />
          }
          label="Statistical Analysis"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={sections.appendices}
              onChange={() => handleSectionToggle('appendices')}
            />
          }
          label="Appendices"
        />
      </FormGroup>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Preview />}
          onClick={() => setPreviewOpen(true)}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          startIcon={generating ? <CircularProgress size={20} /> : <Download />}
          onClick={generatePDF}
          disabled={generating}
          sx={{
            backgroundColor: '#1E3A5F',
            '&:hover': { backgroundColor: '#152A47' },
            flex: 1
          }}
        >
          {generating ? 'Generating...' : 'Generate PDF'}
        </Button>
      </Box>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Report Preview</DialogTitle>
        <DialogContent>
          <Typography>
            Preview functionality would show a preview of the report here.
            In production, this would render the actual report content.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
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
    </Paper>
  );
};

