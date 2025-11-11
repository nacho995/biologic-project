import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Image as ImageIcon,
  ViewCarousel as SliderIcon,
  GridView as GridIcon,
  ViewInAr as MultiIcon,
  Description as CsvIcon,
  PhotoLibrary as ImageManagerIcon,
  Layers as CompositionIcon,
  CloudUpload as UploadIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { FileUploader } from './components/FileUploader/FileUploader.jsx';
import { ImageViewer } from './components/ImageViewer/ImageViewer.jsx';
import { ColorControlPanel } from './components/ColorControlPanel/ColorControlPanel.jsx';
import { ZoomControls } from './components/ZoomControls/ZoomControls.jsx';
import { MetadataPanel } from './components/MetadataPanel/MetadataPanel.jsx';
import { SliderView } from './components/SliderView/SliderView.jsx';
import { GridView } from './components/GridView/GridView.jsx';
import { MultiDimensionalViewer } from './components/MultiDimensionalViewer/MultiDimensionalViewer.jsx';
import { CSVManager } from './components/CSVManager/CSVManager.jsx';
import { ImageManager } from './components/ImageManager/ImageManager.jsx';
import { CompositionPanel } from './components/CompositionPanel/CompositionPanel.jsx';
import { CompositionCanvas } from './components/CompositionCanvas/CompositionCanvas.jsx';
import { AnalyticsDashboard } from './components/AnalyticsDashboard/AnalyticsDashboard.jsx';

const navigationItems = [
  { id: 'single', label: 'Single View', icon: <ImageIcon /> },
  { id: 'slider', label: 'Slider', icon: <SliderIcon /> },
  { id: 'grid', label: 'Grid View', icon: <GridIcon /> },
  { id: 'multi', label: 'Multi-Dimensional', icon: <MultiIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { id: 'csv', label: 'CSV Manager', icon: <CsvIcon /> },
  { id: 'images', label: 'Image Manager', icon: <ImageManagerIcon /> },
  { id: 'composition', label: 'Composition', icon: <CompositionIcon /> },
];

function App() {
  const [viewMode, setViewMode] = useState('single');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewModeChange = (newValue) => {
    setViewMode(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Top App Bar - Ultra Professional */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#FFFFFF',
          color: '#1A202C',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: '64px', md: '80px' },
            px: { xs: 2, sm: 3, md: 4 },
            justifyContent: 'space-between',
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                color: '#1E3A5F',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Biological Image Visualization
            </Typography>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                color: '#1E3A5F',
                fontSize: '1.125rem',
                letterSpacing: '-0.01em',
                display: { xs: 'block', sm: 'none' },
              }}
            >
              BioImage
            </Typography>
          </Box>

          {/* Right Section - Professional Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              borderRadius: 2,
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#F3F4F6',
                borderColor: '#D1D5DB',
              },
            }}
          >
            <UploadIcon
              sx={{
                color: '#1E3A5F',
                fontSize: { xs: 18, sm: 20 },
              }}
            />
            <Typography
              variant="overline"
              sx={{
                color: '#1E3A5F',
                fontWeight: 600,
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                letterSpacing: '0.08em',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Professional Edition
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>


      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: { xs: '64px', md: '80px' },
          backgroundColor: '#F8F9FA',
          minHeight: { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 80px)' },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 3, sm: 4, md: 5 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Upload Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              mb: { xs: 3, sm: 4 },
              borderRadius: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <FileUploader />
          </Paper>

          {/* Tabs for View Modes */}
          <Paper
            elevation={0}
            sx={{
              mb: { xs: 3, sm: 4 },
              borderRadius: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={viewMode}
              onChange={(e, newValue) => handleViewModeChange(newValue)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              aria-label="view mode selection"
              sx={{
                borderBottom: '1px solid #E5E7EB',
                minHeight: { xs: 56, md: 64 },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              {navigationItems.map((item) => (
                <Tab
                  key={item.id}
                  label={item.label}
                  value={item.id}
                  icon={item.icon}
                  iconPosition="start"
                  sx={{
                    textTransform: 'none',
                    fontWeight: viewMode === item.id ? 600 : 500,
                    minHeight: { xs: 56, md: 64 },
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    '&.Mui-selected': {
                      color: '#1E3A5F',
                    },
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Content Grid - Fully Responsive */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Main Content Area */}
            <Grid
              item
              xs={12}
              md={viewMode === 'composition' ? 8 : 8}
              lg={viewMode === 'composition' ? 8 : 8}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  minHeight: { xs: '400px', sm: '500px', md: '600px' },
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                {viewMode === 'single' && <ImageViewer />}
                {viewMode === 'slider' && <SliderView />}
                {viewMode === 'grid' && <GridView />}
                {viewMode === 'multi' && <MultiDimensionalViewer />}
                {viewMode === 'analytics' && <AnalyticsDashboard />}
                {viewMode === 'csv' && <CSVManager />}
                {viewMode === 'images' && <ImageManager />}
                {viewMode === 'composition' && <CompositionCanvas />}
              </Paper>
            </Grid>

            {/* Sidebar Controls */}
            <Grid
              item
              xs={12}
              md={viewMode === 'composition' ? 4 : 4}
              lg={viewMode === 'composition' ? 4 : 4}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 2, sm: 3 },
                }}
              >
                {viewMode === 'composition' ? (
                  <CompositionPanel />
                ) : (
                  <>
                    <ZoomControls />
                    <ColorControlPanel />
                    <MetadataPanel />
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Professional Footer */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3, md: 4 },
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontWeight: 500,
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
          >
            Biological Image Visualization System © {new Date().getFullYear()} | Professional Edition
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
