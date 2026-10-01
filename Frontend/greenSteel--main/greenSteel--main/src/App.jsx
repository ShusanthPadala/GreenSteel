import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import { palette as p, depth, headingFont } from './styles/tokens';
import './styles/globals.css';

const theme = createTheme({
  palette: {
    primary: { main: p.primary, dark: p.primaryDark, light: p.primaryLight, contrastText: '#FFFFFF' },
    secondary: { main: p.primary, contrastText: p.text },
    background: { default: p.bg, paper: p.surface },
    text: { primary: p.text, secondary: p.textSecondary },
    error: { main: p.error },
    warning: { main: p.warning },
    success: { main: p.success },
    info: { main: p.social },
    divider: p.border,
  },
  typography: {
    fontFamily: '"Inter", system-ui, "Segoe UI", sans-serif',
    h1: { fontFamily: headingFont, fontSize: 'clamp(1.75rem, 2.6vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.15 },
    h2: { fontFamily: headingFont, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.3 },
    h3: { fontFamily: headingFont, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.4 },
    body1: { fontSize: '0.95rem', lineHeight: 1.6, color: p.text },
    body2: { fontSize: '0.875rem', lineHeight: 1.55, color: p.textSecondary },
    button: { fontSize: '0.875rem', fontWeight: 650, textTransform: 'none', letterSpacing: '0.005em' },
    caption: { fontSize: '0.8125rem', lineHeight: 1.4 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          minHeight: 44,
          transition: 'transform 180ms cubic-bezier(.2,.8,.2,1), background 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
          '&:active': { transform: 'translateY(1px) scale(0.99)' },
        },
        containedPrimary: {
          color: '#FFFFFF',
          background: `linear-gradient(180deg, #059669 0%, ${p.primary} 55%, ${p.primaryDark} 100%)`,
          border: `1px solid ${p.primaryDeep}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 0 ${p.primaryDeep}, 0 6px 14px -4px rgba(6,78,59,0.45)`,
          '&:hover': {
            background: `linear-gradient(180deg, #065F46 0%, ${p.primaryDark} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 3px 0 ${p.primaryDeep}, 0 14px 24px -8px rgba(6,78,59,0.5)`,
          },
          '&.Mui-disabled': { color: 'rgba(255,255,255,0.8)', opacity: 0.7, background: p.primary },
        },
        outlined: {
          borderColor: p.border,
          color: p.text,
          backgroundColor: 'rgba(255,255,255,0.85)',
          boxShadow: `${depth.inset}, 0 1px 2px rgba(15,23,42,0.05)`,
          '&:hover': {
            backgroundColor: '#FFFFFF',
            borderColor: p.borderStrong,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 18px -6px rgba(6,78,59,0.18)',
          },
        },
        text: { '&:hover': { backgroundColor: 'rgba(4,120,87,0.06)' } },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { transition: 'transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease' } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          backgroundColor: 'rgba(255,255,255,0.82)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.95)',
          outline: `1px solid ${p.border}`,
          outlineOffset: -1,
          boxShadow: `${depth.inset}, ${depth[2]}`,
          transition: 'transform 260ms cubic-bezier(.2,.8,.2,1), box-shadow 260ms ease, outline-color 260ms ease',
          // Every card lifts and glows on hover
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-3px)',
              outlineColor: 'rgba(4,120,87,0.28)',
              boxShadow: `${depth.inset}, ${depth[3]}, 0 0 0 4px rgba(52,211,153,0.10)`,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 12,
          boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.05)',
          transition: 'box-shadow 180ms ease, background-color 180ms ease',
          '& fieldset': { borderColor: p.border, transition: 'border-color 180ms ease' },
          '&:hover:not(.Mui-disabled):not(.Mui-focused) fieldset': { borderColor: p.borderStrong },
          '&.Mui-focused': { backgroundColor: '#FFFFFF', boxShadow: '0 0 0 4px rgba(4,120,87,0.14)' },
          '&.Mui-focused fieldset': { borderColor: `${p.primary} !important`, borderWidth: '1px !important' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${p.border}`, padding: '14px 18px' },
        head: {
          fontSize: '0.72rem',
          fontWeight: 700,
          color: p.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          backgroundColor: 'rgba(246,248,250,0.85)',
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 160ms ease, box-shadow 160ms ease',
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(236,253,245,0.55)',
            boxShadow: `inset 3px 0 0 ${p.primary}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999, fontWeight: 650 } },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 14, alignItems: 'center', boxShadow: depth[1], border: '1px solid rgba(15,23,42,0.06)' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          backgroundImage: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)',
          border: '1px solid rgba(255,255,255,0.95)',
          outline: `1px solid ${p.border}`,
          boxShadow: '0 40px 80px -20px rgba(15,23,42,0.35), 0 12px 24px -8px rgba(15,23,42,0.15)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { '&:not(.MuiBackdrop-invisible)': { backgroundColor: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(6px)' } },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: p.night, borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, padding: '6px 10px' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${p.border}`,
          boxShadow: '0 24px 48px -12px rgba(15,23,42,0.25)',
        },
      },
    },
    MuiCircularProgress: { defaultProps: { thickness: 4.5 } },
  },
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
