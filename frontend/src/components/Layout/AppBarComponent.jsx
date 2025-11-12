import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

const AppBarComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
            placeholder="Search images..."
            size="small"
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

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              size={isMobile ? 'small' : 'medium'}
              sx={{
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <SearchIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
          )}

          <IconButton
            color="inherit"
            size={isMobile ? 'small' : 'medium'}
            sx={{
              transition: 'all 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            size={isMobile ? 'small' : 'medium'}
            sx={{
              transition: 'all 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <SettingsIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>

          <Avatar
            sx={{
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
              ml: { xs: 0.5, sm: 1, md: 2 },
              background: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 700,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
              },
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;

