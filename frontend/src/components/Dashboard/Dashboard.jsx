import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, alpha, LinearProgress } from '@mui/material';
import {
  Image as ImageIcon,
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import MetricCard from './MetricCard';
import { useImageStore } from '../../store/imageStore.js';

const Dashboard = ({ onViewAllClick }) => {
  const { images } = useImageStore();
  const [stats, setStats] = useState({
    totalImages: 0,
    totalSize: 0,
    recentUploads: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [images]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const totalImages = images.length;
      const totalSize = images.reduce((acc, img) => acc + (img.fileSize || 0), 0);

      const recentUploads = [...images]
        .sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0))
        .slice(0, 5);

      setStats({
        totalImages,
        totalSize,
        recentUploads,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>Loading dashboard...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4, md: 5 },
          animation: 'slideInFromBottom 0.6s ease-out 0.2s both',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
            fontWeight: 900,
            letterSpacing: '-0.03em',
            mb: 1,
            background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: { xs: -4, md: -8 },
              left: 0,
              width: { xs: 60, md: 100 },
              height: { xs: 3, md: 4 },
              background: 'linear-gradient(90deg, #1976D2, #42A5F5, #2E7D32)',
              borderRadius: 2,
              animation: 'shimmer 3s infinite',
            },
          }}
        >
          Dashboard Overview
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Grid item xs={12} sm={6} lg={4}>
          <MetricCard
            icon={ImageIcon}
            value={stats.totalImages.toString()}
            label="Total Images"
            color="primary"
            delay={0.3}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MetricCard
            icon={FileIcon}
            value={formatFileSize(stats.totalSize)}
            label="Total Storage"
            color="secondary"
            delay={0.4}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MetricCard
            icon={UploadIcon}
            value={stats.recentUploads.length.toString()}
            label="Recent Uploads"
            color="info"
            delay={0.5}
          />
        </Grid>
      </Grid>

      {/* Recent Activity Card */}
      <Card
        sx={{
          mb: { xs: 2, sm: 2.5, md: 3 },
          animation: 'slideInFromBottom 0.6s ease-out 0.7s both',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #1976D2, #42A5F5, #2E7D32)',
            opacity: 0,
            transition: 'opacity 0.3s',
          },
          '&:hover::before': {
            opacity: 1,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 2, sm: 2.5, md: 3.5 },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                alignSelf: { xs: 'flex-start', sm: 'auto' },
              }}
            >
              Recent Activity
            </Typography>
            <Typography
              variant="body2"
              onClick={() => onViewAllClick && onViewAllClick()}
              sx={{
                color: '#42A5F5',
                fontWeight: 700,
                cursor: 'pointer',
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.3s',
                fontSize: { sm: '0.875rem', md: '1rem' },
                '&:hover': {
                  color: '#64B5F6',
                  transform: 'translateX(4px)',
                },
              }}
            >
              View All →
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
            {stats.recentUploads.length > 0 ? (
              stats.recentUploads.map((image, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: { xs: 1.5, md: 2 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2, md: 3.5 },
                  background: alpha('#FFFFFF', 0.03),
                  border: '1px solid transparent',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: alpha('#FFFFFF', 0.08),
                    borderColor: alpha('#1976D2', 0.3),
                    transform: { xs: 'translateX(4px)', md: 'translateX(8px)' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
                    mt: 1,
                    flexShrink: 0,
                    boxShadow: '0 0 12px rgba(25, 118, 210, 0.6)',
                    animation: 'glowPulse 2s ease-in-out infinite',
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    {image.originalFilename || `Image ${image.id.slice(0, 8)}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha('#FFFFFF', 0.5),
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                    }}
                  >
                    {formatDate(image.uploadDate)} • {formatFileSize(image.fileSize)}
                    {image.dimensions && ` • ${image.dimensions.width}×${image.dimensions.height}`}
                  </Typography>
                </Box>
              </Box>
            ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: alpha('#FFFFFF', 0.5) }}>
                <Typography variant="body2">No recent uploads</Typography>
                <Typography variant="caption">Upload TIFF images to get started</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {stats.totalImages > 0 && (
        <Card sx={{ animation: 'slideInFromBottom 0.6s ease-out 0.8s both' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                mb: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
              Quick Stats
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, background: alpha('#1976D2', 0.1), borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight={700}>
                    {stats.totalImages}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Images Uploaded
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, background: alpha('#2E7D32', 0.1), borderRadius: 2 }}>
                  <Typography variant="h4" color="secondary.main" fontWeight={700}>
                    {formatFileSize(stats.totalSize)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Storage Used
              </Typography>
              </Box>
        </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, background: alpha('#3B82F6', 0.1), borderRadius: 2 }}>
                  <Typography variant="h4" color="info.main" fontWeight={700}>
                    TIFF
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Primary Format
              </Typography>
              </Box>
              </Grid>
            </Grid>
            </CardContent>
          </Card>
      )}
    </Box>
  );
};

export default Dashboard;
