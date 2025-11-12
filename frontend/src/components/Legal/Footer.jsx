import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
} from '@mui/icons-material';

export const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Biological Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Advanced platform for biological and microscopy image analysis.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" aria-label="GitHub">
                <GitHub />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="Email">
                <Email />
              </IconButton>
            </Box>
          </Grid>

          {/* Product */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#features" color="text.secondary" underline="hover" variant="body2">
                Features
              </Link>
              <Link href="#pricing" color="text.secondary" underline="hover" variant="body2">
                Pricing
              </Link>
              <Link href="#documentation" color="text.secondary" underline="hover" variant="body2">
                Documentation
              </Link>
              <Link href="#api" color="text.secondary" underline="hover" variant="body2">
                API Reference
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#tutorials" color="text.secondary" underline="hover" variant="body2">
                Tutorials
              </Link>
              <Link href="#support" color="text.secondary" underline="hover" variant="body2">
                Support
              </Link>
              <Link href="#community" color="text.secondary" underline="hover" variant="body2">
                Community
              </Link>
              <Link href="#changelog" color="text.secondary" underline="hover" variant="body2">
                Changelog
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/privacy-policy" color="text.secondary" underline="hover" variant="body2">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" color="text.secondary" underline="hover" variant="body2">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" color="text.secondary" underline="hover" variant="body2">
                Cookie Policy
              </Link>
              <Link href="/data-processing" color="text.secondary" underline="hover" variant="body2">
                Data Processing
              </Link>
              <Link href="/compliance" color="text.secondary" underline="hover" variant="body2">
                GDPR Compliance
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Biological Analysis Platform. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for the scientific community
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            This platform complies with GDPR, HIPAA, and other international data protection regulations.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

