import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, InputAdornment, IconButton,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import LazySteelScene from '../components/three/LazySteelScene';
import { palette as p, hero, headingFont } from '../styles/tokens';

const features = [
  ['Live operational visibility', 'Real-time unit status across the plant'],
  ['ESG performance intelligence', 'Environmental, social & governance scores'],
  ['Secure enterprise access', 'Role-based permissions for every team'],
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';
  const reduceMotion = useReducedMotion();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleResetRequest = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setResetError('Enter a valid work email address.');
      return;
    }
    setResetError('');
    try {
      setResetLoading(true);
      await authService.forgotPassword(resetEmail.trim());
      setResetMessage('If an account exists for this email, we\'ve sent a password reset link.');
    } catch (requestError) {
      setResetError(getErrorMessage(requestError, 'We could not process your request. Please try again.'));
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const email = credentials.email.trim();
    if (!email || !credentials.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, credentials.password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid email or password.');
      }
    } finally {
        setLoading(false);
    }
  };

  const fade = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] },
  });

  const labelSx = { display: 'block', mb: 1, fontWeight: 650, color: p.text, fontSize: '0.8125rem' };
  const inputSx = { '& .MuiOutlinedInput-root': { minHeight: 52, bgcolor: '#FFFFFF' } };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 1.5, sm: 3 },
      overflowX: 'hidden',
      position: 'relative',
      background: `radial-gradient(900px 600px at 15% 10%, rgba(52,211,153,0.16), transparent 60%), radial-gradient(800px 600px at 90% 90%, rgba(4,120,87,0.18), transparent 60%), linear-gradient(160deg, #EEF6F3 0%, #E2ECEA 100%)`,
    }}>
      <div className="gs-grid-bg" aria-hidden />
      <Box className="glass-orb" sx={{ width: 320, height: 320, top: '4%', left: '6%', bgcolor: 'rgba(52, 211, 153, 0.22)' }} />
      <Box className="glass-orb" sx={{ width: 380, height: 380, right: '2%', bottom: '0%', bgcolor: 'rgba(4, 120, 87, 0.18)', animationDelay: '-5s' }} />

      <Box
        component={motion.div}
        initial={reduceMotion ? false : { opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformPerspective: 1400 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: 1180,
          minWidth: 0,
          minHeight: { md: 760 },
          borderRadius: { xs: '24px', md: '32px' },
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 40px 80px -24px rgba(15,23,42,0.35), 0 80px 120px -60px rgba(6,78,59,0.35)',
        }}
      >
        {/* LEFT — 3D brand panel */}
        <Box sx={{
          flex: 1.25,
          width: '100%',
          minWidth: 0,
          minHeight: { xs: 360, md: 'auto' },
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF',
          background: `${hero.glow}, ${hero.gradient(160)}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: 3.5, md: 5, lg: 6 },
        }}>
          <LazySteelScene variant="hero" offsetX={1.1} offsetY={2.95} scale={0.76} />
          {/* readability scrim */}
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,78,59,0) 0%, rgba(6,78,59,0) 50%, rgba(6,78,59,0.45) 100%)', pointerEvents: 'none' }} />

          <Box component={motion.div} {...fade(0.15)} sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontFamily: headingFont, fontSize: '1.25rem', lineHeight: 1.1, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              GreenSteel
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', mt: { xs: 16, md: 0 } }}>
            <Box component={motion.div} {...fade(0.25)}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.5, mb: 2, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)' }}>
                <span className="gs-live-dot" />
                <Typography sx={{ color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Enterprise sustainability console
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '2.75rem' }, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.05, mb: 2, letterSpacing: '-0.04em', textShadow: '0 2px 18px rgba(6,78,59,0.35)' }}>
                Enterprise Environmental{' '}
                <Box component="span" sx={{ background: 'linear-gradient(90deg, #FFFFFF, #A7F3D0)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  Monitoring
                </Box>
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.7, maxWidth: 420, overflowWrap: 'anywhere' }}>
                Monitor emissions, track ESG metrics, and manage industrial sustainability from a single enterprise console.
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 0.75, mt: 3 }}>
              {features.map(([item, hint], idx) => (
                <Box
                  key={item}
                  component={motion.div}
                  {...fade(0.35 + idx * 0.08)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 0.9, borderRadius: '14px',
                    bgcolor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.24)', backdropFilter: 'blur(10px)',
                    maxWidth: 420,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.mint, boxShadow: `0 0 0 4px rgba(52,211,153,0.15), 0 0 12px ${p.mint}`, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 650 }}>{item}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem' }}>{hint}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* RIGHT — form */}
        <Box sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          p: { xs: 3.5, sm: 5, lg: 7 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.88)',
        }}>
          <Box component={motion.div} {...fade(0.2)} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h1" sx={{ fontSize: '2rem', mb: 1 }}>
              Welcome back
            </Typography>
            <Typography sx={{ fontSize: '0.95rem', color: p.textSecondary, mb: 4 }}>
              Please enter your details to sign in.
            </Typography>

            {sessionExpired && !error && (
              <Alert severity="info" sx={{ mb: 3 }}>Your session has expired. Please sign in again.</Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin} noValidate>
              <Box sx={{ mb: 2.5 }}>
                <Typography component="label" htmlFor="email" sx={labelSx}>
                  Email
                </Typography>
                <TextField
                  id="email"
                  fullWidth
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  sx={inputSx}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><MailOutlineIcon sx={{ fontSize: 20, color: p.textSecondary }} /></InputAdornment> } }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography component="label" htmlFor="password" sx={labelSx}>
                  Password
                </Typography>
                <TextField
                  id="password"
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  sx={inputSx}
                  slotProps={{ input: {
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 20, color: p.textSecondary }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          sx={{ color: p.textSecondary }}
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  } }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                  type="button"
                  onClick={() => { setResetEmail(credentials.email); setResetMessage(''); setResetOpen(true); }}
                  sx={{ color: p.primary, fontWeight: 650, fontSize: '0.8125rem', minHeight: 32, px: 1, py: 0.5 }}
                >
                  Forgot Password?
                </Button>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? null : <ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  minHeight: 54,
                  borderRadius: '14px',
                  '& .MuiButton-endIcon': { transition: 'transform 200ms ease' },
                  '&:hover .MuiButton-endIcon': { transform: 'translateX(4px)' },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Typography sx={{ mt: 4, textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
              Protected by enterprise-grade encryption
            </Typography>
          </Box>
        </Box>
      </Box>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pt: 3.5, px: 3.5, pb: 1, fontFamily: headingFont, fontWeight: 800, fontSize: '1.3rem' }}>
          Forgot your password?
        </DialogTitle>
        <DialogContent sx={{ px: 3.5 }}>
          {resetError && <Alert severity="error" sx={{ mt: 1, mb: 2 }}>{resetError}</Alert>}
          {resetMessage ? (
            <Box sx={{ pt: 1, textAlign: 'center' }}>
              <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '20px', display: 'grid', placeItems: 'center', color: '#fff', background: `linear-gradient(145deg, #059669, ${p.primaryDark})`, boxShadow: '0 12px 24px -8px rgba(6,78,59,0.5), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
                <MarkEmailReadOutlinedIcon />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: p.text, mb: 1 }}>Check your email</Typography>
              <Typography variant="body2">{resetMessage}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>For security, we do not reveal whether an account exists for this email.</Typography>
            </Box>
          ) : (
            <Box component="form" id="reset-password-form" onSubmit={handleResetRequest} sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ mb: 2.5 }}>
                Enter the email address associated with your GreenSteel account and we&apos;ll send you a password reset link.
              </Typography>
              <TextField
                autoFocus
                fullWidth
                label="Work email"
                type="email"
                required
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3.5, pb: 3.5, gap: 1 }}>
          <Button variant="outlined" onClick={() => setResetOpen(false)}>{resetMessage ? 'Back to Sign In' : 'Cancel'}</Button>
          {!resetMessage && <Button variant="contained" type="submit" form="reset-password-form" disabled={resetLoading}>{resetLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
