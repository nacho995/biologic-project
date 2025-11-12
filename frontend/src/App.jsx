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
import { VolumetricViewer3D } from './components/VolumetricViewer3D/VolumetricViewer3D.jsx';
import { ImageManager } from './components/ImageManager/ImageManager.jsx';
import { CompositionPanel } from './components/CompositionPanel/CompositionPanel.jsx';
import { CompositionCanvas } from './components/CompositionCanvas/CompositionCanvas.jsx';
import { AnalyticsDashboard } from './components/AnalyticsDashboard/AnalyticsDashboard.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import AppBarComponent from './components/Layout/AppBarComponent.jsx';
import { CookieBanner } from './components/Legal/CookieBanner.jsx';
import { Footer } from './components/Legal/Footer.jsx';
import {
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'single', label: 'Single View', icon: <ImageIcon /> },
  { id: 'slider', label: 'Slider', icon: <SliderIcon /> },
  { id: 'grid', label: 'Grid View', icon: <GridIcon /> },
  { id: 'multi', label: '3D Volumetric', icon: <MultiIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { id: 'images', label: 'Image Manager', icon: <ImageManagerIcon /> },
  { id: 'composition', label: 'Composition', icon: <CompositionIcon /> },
];

function App() {
  const [viewMode, setViewMode] = useState('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewModeChange = (newValue) => {
    setViewMode(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBarComponent />


      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          mt: { xs: '64px', sm: '64px', md: '72px' },
          minHeight: { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 72px)' },
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
            elevation={2}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              mb: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
            }}
          >
            <FileUploader />
          </Paper>

          {/* Tabs for View Modes */}
          <Paper
            elevation={2}
            sx={{
              mb: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={viewMode}
              onChange={(e, newValue) => handleViewModeChange(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="view mode selection"
              sx={{
                minHeight: { xs: 60, md: 68 },
                px: { xs: 1, sm: 2 },
                '& .MuiTabs-scrollButtons': {
                  opacity: 1,
                  color: 'primary.main',
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
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
              md={8}
              lg={8}
              sx={{
                order: { xs: 1, md: 1 },
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  minHeight: { xs: '450px', sm: '550px', md: '650px' },
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {viewMode === 'dashboard' && <Dashboard onViewAllClick={() => setViewMode('images')} />}
                {viewMode === 'single' && <ImageViewer />}
                {viewMode === 'slider' && <SliderView />}
                {viewMode === 'grid' && <GridView />}
                {viewMode === 'multi' && <VolumetricViewer3D />}
                {viewMode === 'analytics' && <AnalyticsDashboard />}
                {viewMode === 'images' && <ImageManager />}
                {viewMode === 'composition' && <CompositionCanvas />}
              </Paper>
            </Grid>

            {/* Sidebar Controls */}
            <Grid
              item
              xs={12}
              md={4}
              lg={4}
              sx={{
                order: { xs: 2, md: 2 },
              }}
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

        {/* Footer */}
        <Footer />
      </Box>

      {/* Cookie Banner */}
      <CookieBanner />
    </Box>
  );
}

export default App;
