import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { useImageStore } from '../../store/imageStore.js';

const AppBarComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [searchQuery, setSearchQuery] = useState('');
  const { images, setImages } = useImageStore();
  const [allImages, setAllImages] = useState([]);

  // Save all images when they're loaded
  React.useEffect(() => {
    if (images.length > 0 && allImages.length === 0) {
      setAllImages(images);
    }
  }, [images]);

  // Search functionality
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      // Reset to all images when search is empty
      setImages(allImages);
      return;
    }

    // Filter images by filename
    const filtered = allImages.filter((img) =>
      img.originalFilename?.toLowerCase().includes(query.toLowerCase())
    );
    setImages(filtered);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        height: { xs: '64px', md: '72px' },
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 }, minHeight: { xs: '64px', md: '72px' } }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          {!isMobile && (
            <Box
              sx={{
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              }}
            >
              <ScienceIcon sx={{ fontSize: { xs: 20, md: 24 }, color: '#fff' }} />
            </Box>
          )}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Biological Analysis
            </Typography>
            {!isMobile && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { sm: '0.625rem', md: '0.75rem' },
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Advanced Image Processing
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar - Hidden on mobile */}
        {!isMobile && (
          <TextField
            placeholder="Search images by filename..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: { sm: '200px', md: '280px', lg: '320px' },
              mr: { sm: 2, md: 3 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: { sm: 18, md: 20 } }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Search Icon for Mobile */}
        {isMobile && (
          <IconButton
            color="inherit"
            size="small"
            sx={{
              transition: 'all 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
            onClick={() => {
              // Could open a search dialog on mobile
              const query = prompt('Search images by filename:');
              if (query !== null) {
                setSearchQuery(query);
                if (!query.trim()) {
                  setImages(allImages);
                } else {
                  const filtered = allImages.filter((img) =>
                    img.originalFilename?.toLowerCase().includes(query.toLowerCase())
                  );
                  setImages(filtered);
                }
              }
            }}
          >
            <SearchIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;


