import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Link,
  Switch,
  FormControlLabel,
  Collapse,
  Alert,
} from '@mui/material';
import { Close, Settings } from '@mui/icons-material';

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: { xs: 0, md: 20 },
        left: { xs: 0, md: 20 },
        right: { xs: 0, md: 'auto' },
        maxWidth: { xs: '100%', md: 500 },
        zIndex: 9999,
        borderRadius: { xs: 0, md: 2 },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, pr: 2 }}>
            🍪 Cookie Settings
          </Typography>
          <IconButton size="small" onClick={acceptNecessary}>
            <Close />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          We use cookies to enhance your experience, analyze site traffic, and personalize content.
          By clicking "Accept All", you consent to our use of cookies.
        </Typography>

        <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
          Necessary cookies are always enabled as they are required for the basic functionality of the site.
        </Alert>

        <Collapse in={showSettings}>
          <Box sx={{ mb: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.necessary}
                  disabled
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Necessary</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Required for basic site functionality
                  </Typography>
                </Box>
              }
              sx={{ mb: 1, alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Functional</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable enhanced functionality and personalization
                  </Typography>
                </Box>
              }
              sx={{ mb: 1, alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Analytics</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Help us improve by collecting anonymous usage data
                  </Typography>
                </Box>
              }
              sx={{ mb: 1, alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Marketing</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Personalized content and advertisements
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          </Box>
        </Collapse>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          <Button
            variant="contained"
            onClick={showSettings ? savePreferences : acceptAll}
            fullWidth
            sx={{ fontWeight: 600 }}
          >
            {showSettings ? 'Save Preferences' : 'Accept All'}
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowSettings(!showSettings)}
              startIcon={<Settings />}
              sx={{ flex: 1 }}
            >
              {showSettings ? 'Hide' : 'Customize'}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={acceptNecessary}
              sx={{ flex: 1 }}
            >
              Necessary Only
            </Button>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          <Link href="/privacy-policy" underline="hover" color="primary">
            Privacy Policy
          </Link>
          {' • '}
          <Link href="/cookie-policy" underline="hover" color="primary">
            Cookie Policy
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

