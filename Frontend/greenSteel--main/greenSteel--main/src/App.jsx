import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3F654B',
      dark: '#304D39',
      light: '#EAF1EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3F654B',
      contrastText: '#17201B',
    },
    background: {
      default: '#F5F7F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#17211B',
      secondary: '#66716A',
    },
    error: { main: '#C65353' },
    warning: { main: '#B9822B' },
    success: { main: '#3F7A52' },
    divider: '#DDE4DE',
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "Segoe UI", sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.5, color: '#17201B' },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#66716A' },
    button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { fontSize: '0.8125rem', lineHeight: 1.4 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          minHeight: 44,
          '&:active': { transform: 'scale(0.98)' },
          transition: 'transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        },
        containedPrimary: {
          backgroundColor: '#3F654B',
          color: '#FFFFFF',
          border: '1px solid #1D3326',
          '&:hover': {
            backgroundColor: '#304D39',
            boxShadow: '0 4px 12px rgba(53, 94, 69, 0.2)',
            transform: 'translateY(-1px)',
          }
        },
        outlined: {
          borderColor: '#DDE4DE',
          color: '#17211B',
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          '&:hover': {
            backgroundColor: '#F0F4F0',
            borderColor: '#66716A',
            transform: 'translateY(-1px)',
            boxShadow: '0 3px 10px rgba(23, 33, 27, 0.08)',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #DDE4DE',
          boxShadow: '0 8px 24px rgba(44, 83, 58, 0.07)',
          backgroundImage: 'none',
          backdropFilter: 'blur(14px)',
          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: '#C8D7CC',
            boxShadow: '0 8px 22px rgba(23, 32, 27, 0.08)',
          },
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            border: '1px solid #DDE2DD',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '& fieldset': { border: 'none' },
            '&.Mui-focused': {
              borderColor: '#355E45',
              boxShadow: '0 0 0 3px rgba(53, 94, 69, 0.15)',
            },
            '&:hover:not(.Mui-disabled):not(.Mui-focused)': {
              borderColor: '#66716A',
              boxShadow: '0 3px 10px rgba(23, 32, 27, 0.06)',
            },
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #DDE2DD',
          padding: '14px 16px',
        },
        head: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#66716A',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          backgroundColor: '#FFFFFF',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(23, 32, 27, 0.12)',
          border: '1px solid #DDE2DD',
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
