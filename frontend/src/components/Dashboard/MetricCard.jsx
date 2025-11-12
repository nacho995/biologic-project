import React from 'react';
import { Card, CardContent, Box, Typography, alpha, useTheme, useMediaQuery } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const MetricCard = ({ icon: Icon, value, label, trend, color = 'primary', delay = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '140px', sm: '160px', md: '180px' },
        background: alpha(theme.palette[color].main, 0.08),
        border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `slideInFromBottom 0.6s ease-out ${delay}s both`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
          opacity: 0,
          transition: 'opacity 0.3s',
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.4)}`,
          borderColor: theme.palette[color].main,
          '&::before': {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: { xs: 1.5, md: 2 } }}>
          <Box
            sx={{
              width: { xs: 48, sm: 52, md: 56 },
              height: { xs: 48, sm: 52, md: 56 },
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 16px ${alpha(theme.palette[color].main, 0.4)}`,
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <Icon sx={{ fontSize: { xs: 24, sm: 26, md: 28 }, color: theme.palette[color].contrastText }} />
          </Box>
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.3, md: 0.5 },
                px: { xs: 1, md: 1.5 },
                py: { xs: 0.3, md: 0.5 },
                borderRadius: 2,
                background: trend > 0 ? alpha('#4CAF50', 0.15) : alpha('#F44336', 0.15),
                border: `1px solid ${trend > 0 ? alpha('#4CAF50', 0.3) : alpha('#F44336', 0.3)}`,
              }}
            >
              {trend > 0 ? (
                <TrendingUp sx={{ fontSize: { xs: 14, md: 16 }, color: '#4CAF50' }} />
              ) : (
                <TrendingDown sx={{ fontSize: { xs: 14, md: 16 }, color: '#F44336' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: trend > 0 ? '#4CAF50' : '#F44336',
                  fontSize: { xs: '0.625rem', md: '0.75rem' },
                }}
              >
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            mb: { xs: 0.5, md: 1 },
            color: theme.palette[color].main,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            letterSpacing: '-0.02em',
            textShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.3)}`,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MetricCard;


