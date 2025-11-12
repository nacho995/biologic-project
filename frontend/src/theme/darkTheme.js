import { createTheme, alpha } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BCD4',
      light: '#26C6DA',
      dark: '#00838F',
      contrastText: '#000000',
    },
    secondary: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#2E7D32',
      contrastText: '#000000',
    },
    success: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
      disabled: '#6B6B6B',
    },
    divider: '#2C2C2C',
    action: {
      active: '#FFFFFF',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(255, 255, 255, 0.12)',
    },
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '3rem',
      fontWeight: 900,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      opacity: 0.7,
    },
    overline: {
      fontSize: '0.625rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      opacity: 0.6,
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.15)',
    '0px 6px 12px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.25)',
    '0px 10px 20px rgba(0, 0, 0, 0.3)',
    '0px 12px 24px rgba(0, 0, 0, 0.35)',
    '0px 14px 28px rgba(0, 0, 0, 0.4)',
    '0px 16px 32px rgba(0, 0, 0, 0.45)',
    '0px 18px 36px rgba(0, 0, 0, 0.5)',
    '0px 20px 40px rgba(0, 0, 0, 0.55)',
    '0px 22px 44px rgba(0, 0, 0, 0.6)',
    '0px 24px 48px rgba(0, 0, 0, 0.65)',
    '0px 26px 52px rgba(0, 0, 0, 0.7)',
    '0px 28px 56px rgba(0, 0, 0, 0.75)',
    '0px 30px 60px rgba(0, 0, 0, 0.8)',
    '0px 32px 64px rgba(0, 0, 0, 0.85)',
    '0px 34px 68px rgba(0, 0, 0, 0.9)',
    '0px 36px 72px rgba(0, 0, 0, 0.95)',
    '0px 38px 76px rgba(0, 0, 0, 1)',
    '0px 40px 80px rgba(0, 0, 0, 1.05)',
    '0px 42px 84px rgba(0, 0, 0, 1.1)',
    '0px 44px 88px rgba(0, 0, 0, 1.15)',
    '0px 46px 92px rgba(0, 0, 0, 1.2)',
    '0px 48px 96px rgba(0, 0, 0, 1.25)',
  ],

  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(180deg, #121212 0%, #1A1A1A 100%)',
          backgroundAttachment: 'fixed',
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: alpha('#FFFFFF', 0.05),
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#2C2C2C',
            borderRadius: '4px',
            border: '1px solid #3C3C3C',
            '&:hover': {
              background: '#3C3C3C',
            },
          },
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        '@keyframes glowPulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 188, 212, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.3)'
          },
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        '@keyframes slideInFromBottom': {
          '0%': { transform: 'translateY(50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        },
        outlined: {
          border: '1px solid #2C2C2C',
          '&:hover': {
            border: '1px solid #3C3C3C',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
        sizeSmall: {
          padding: '10px 24px',
        },
        sizeLarge: {
          padding: '16px 40px',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1E1E1E',
          border: '1px solid #2C2C2C',
          borderRadius: 4,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            borderColor: '#3C3C3C',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#1E1E1E',
          border: '1px solid #2C2C2C',
        },
        elevation1: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#1E1E1E',
          borderBottom: '1px solid #2C2C2C',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(45, 55, 72, 0.95)',
          color: '#E2E8F0',
          fontSize: '0.75rem',
          padding: '8px 12px',
          borderRadius: 4,
          backdropFilter: 'blur(5px)',
        },
      },
    },
  },
});

export default darkTheme;
