import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Science as ScienceIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { SearchBar } from './SearchBar.jsx';
import { useImageStore } from '../../store/imageStore.js';
import { useAuth } from '../../context/AuthContext.jsx';

const AppBarComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { images, setCurrentImage } = useImageStore();
  const { user, logout } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
        {!isMobile && <SearchBar isMobile={false} theme={theme} />}

        {/* User Info & Logout */}
        {!isMobile && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Chip
                label={user.role}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  backgroundColor: 
                    user.role === 'admin' ? 'error.main' :
                    user.role === 'worker' ? 'success.main' :
                    'info.main',
                }}
              />
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}

        {/* Search Icon for Mobile */}
        {isMobile && (
          <>
            <IconButton
              color="inherit"
              size="small"
              sx={{
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
              }}
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <SearchIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              onClick={logout}
              sx={{
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
                ml: 1,
              }}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </>
        )}
        
        {/* Mobile Search Dropdown */}
        {isMobile && mobileSearchOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              p: 2,
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              zIndex: 9998,
            }}
          >
            <SearchBar isMobile={true} theme={theme} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;


