import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import IconOrb from '../components/ui/IconOrb';
import { palette as p, headingFont } from '../styles/tokens';

export default function ResetPassword() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [state, setState] = useState({ loading: false, error: '', success: false });

  const submit = async (event) => {
    event.preventDefault();
    if (!token) return setState({ loading: false, error: 'This password reset link is invalid or has expired.', success: false });
    if (password.length < 8) return setState({ loading: false, error: 'Password must be at least 8 characters.', success: false });
    if (password !== confirmation) return setState({ loading: false, error: 'Passwords do not match.', success: false });
    try {
      setState({ loading: true, error: '', success: false });
      await authService.resetPassword(token, password);
      setState({ loading: false, error: '', success: true });
    } catch (error) {
      setState({ loading: false, error: getErrorMessage(error, 'This password reset link is invalid or has expired.'), success: false });
    }
  };

  const strength = Math.min(4, [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length);
  const strengthColors = ['#E2E8F0', p.error, p.warning, p.sage, p.primary];

  return (
    <Box sx={{
      minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, position: 'relative', overflow: 'hidden',
      background: `radial-gradient(800px 500px at 20% 10%, rgba(52,211,153,0.16), transparent 60%), radial-gradient(700px 500px at 85% 90%, rgba(4,120,87,0.18), transparent 60%), linear-gradient(160deg, #EEF6F3 0%, #E2ECEA 100%)`,
    }}>
      <div className="gs-grid-bg" aria-hidden />
      <Box className="glass-orb" sx={{ width: 300, height: 300, top: '8%', left: '10%', bgcolor: 'rgba(52, 211, 153, 0.2)' }} />

      <Box
        component={motion.div}
        initial={reduceMotion ? false : { opacity: 0, y: 24, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformPerspective: 1200 }}
        sx={{
          width: '100%', maxWidth: 480, p: { xs: 3.5, sm: 5 }, position: 'relative', zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 40px 80px -24px rgba(15,23,42,0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, perspective: 400 }}>
          <IconOrb size={48}>{state.success ? <TaskAltIcon /> : <LockResetIcon />}</IconOrb>
          <Typography sx={{ fontFamily: headingFont, color: p.primary, fontWeight: 800, letterSpacing: '-0.02em' }}>GreenSteel</Typography>
        </Box>
        {state.success ? (
          <>
            <Typography variant="h1" sx={{ fontSize: '1.8rem', mb: 1 }}>Password reset successfully</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>You can now sign in with your new password.</Typography>
            <Button component={Link} to="/login" variant="contained" fullWidth sx={{ minHeight: 50 }}>Sign In</Button>
          </>
        ) : (
          <>
            <Typography variant="h1" sx={{ fontSize: '1.8rem', mb: 1 }}>Reset your password</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Choose a new password for your GreenSteel account.</Typography>
            {state.error && <Alert severity="error" sx={{ mb: 2 }}>{state.error}</Alert>}
            <form onSubmit={submit}>
              <TextField fullWidth required type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 1.5 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.75, mb: 2 }} aria-hidden>
                {[1, 2, 3, 4].map((n) => (
                  <Box key={n} sx={{ height: 5, borderRadius: 999, bgcolor: n <= strength ? strengthColors[strength] : '#E2E8F0', transition: 'background-color 200ms ease' }} />
                ))}
              </Box>
              <TextField fullWidth required type="password" label="Confirm password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} sx={{ mb: 2 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>Use at least 8 characters.</Typography>
              <Button type="submit" variant="contained" fullWidth disabled={state.loading} sx={{ minHeight: 50 }}>
                {state.loading ? <CircularProgress size={22} color="inherit" /> : 'Reset Password'}
              </Button>
            </form>
            <Button onClick={() => navigate('/login')} sx={{ mt: 1.5, color: p.primary }} fullWidth>Back to Sign In</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
