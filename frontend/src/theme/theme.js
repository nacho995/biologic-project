import { createTheme } from '@mui/material/styles';

// Sistema de diseño ultra-profesional y clásico
export const professionalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A5F', // Azul corporativo oscuro
      light: '#2C5282',
      dark: '#0F1F3A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3498DB', // Azul medio profesional
      light: '#5D9CEC',
      dark: '#2980B9',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA', // Gris muy claro profesional
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C', // Casi negro para máximo contraste
      secondary: '#4A5568', // Gris medio profesional
    },
    divider: 'rgba(0, 0, 0, 0.06)',
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#1A202C',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      color: '#1A202C',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.015em',
      color: '#1A202C',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: '#1A202C',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
      color: '#1A202C',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0em',
      color: '#1A202C',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#4A5568',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#4A5568',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4A5568',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#6B7280',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
      fontSize: '0.9375rem',
    },
    caption: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
      color: '#6B7280',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#6B7280',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  spacing: 8, // Base spacing unit
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#F8F9FA',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          fontSize: '0.9375rem',
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#1A202C',
            borderBottom: '2px solid #E5E7EB',
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '16px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:nth-of-type(even)': {
            backgroundColor: '#FAFBFC',
          },
          '&:hover': {
            backgroundColor: '#F3F4F6',
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E5E7EB',
          padding: '16px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: '#D1D5DB',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1E3A5F',
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: '#EF4444',
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#1E3A5F',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E5E7EB',
          minHeight: 64,
        },
        indicator: {
          backgroundColor: '#1E3A5F',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          minHeight: 64,
          padding: '16px 24px',
          color: '#6B7280',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: '#1E3A5F',
            fontWeight: 600,
          },
          '&:hover': {
            color: '#1A202C',
            backgroundColor: 'rgba(30, 58, 95, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.8125rem',
          height: 28,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E5E7EB',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#1E3A5F',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#1E3A5F',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            width: 20,
            height: 20,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});
