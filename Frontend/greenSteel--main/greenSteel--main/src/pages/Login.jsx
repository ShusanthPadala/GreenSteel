import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <Box sx={{
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      bgcolor: '#19382A',
      p: 2,
      overflowX: 'hidden',
      position: 'relative',
      background: '#EAF3EC'
    }}>
      <Box className="glass-orb" sx={{ width: 260, height: 260, top: '8%', left: '8%', bgcolor: 'rgba(74, 222, 128, 0.18)' }} />
      <Box className="glass-orb" sx={{ width: 320, height: 320, right: '4%', bottom: '2%', bgcolor: 'rgba(21, 128, 61, 0.12)', animationDelay: '-4s' }} />
      <Box className="glass-float" sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: 'calc(100% - 8px)',
        maxWidth: 1040,
        minWidth: 0,
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 24px 70px rgba(10, 29, 20, 0.32)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255,255,255,0.72)',
        backdropFilter: 'blur(18px)',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 30px 80px rgba(10, 29, 20, 0.38)',
        }
      }}>
        
        {/* LEFT SECTION */}
        <Box sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          p: { xs: 4, md: 6, lg: 8 },
          bgcolor: 'rgba(47, 107, 73, 0.92)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 5 }}>
            <Box sx={{ width: 8, height: 30, borderRadius: 1, bgcolor: '#8EB69A' }} />
            <Typography sx={{ fontSize: '1.2rem', lineHeight: 1.1, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              GreenSteel
            </Typography>
          </Box>
          
          <Typography sx={{ color: '#A9C8B2', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', mb: 1.5 }}>
            Enterprise sustainability console
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.15rem' }, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.08, mb: 2.25, letterSpacing: '-0.03em' }}>
            Enterprise<br />Environmental<br />Monitoring
          </Typography>
          
          <Typography sx={{ fontSize: '0.98rem', color: '#C0D2C5', lineHeight: 1.7, maxWidth: 390, overflowWrap: 'anywhere' }}>
            Monitor emissions, track ESG metrics, and manage industrial sustainability from a single enterprise console.
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.25, mt: 6 }}>
            {['Live operational visibility', 'ESG performance intelligence', 'Secure enterprise access'].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: '#DCE9DF', fontSize: '0.82rem' }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#8EB69A', boxShadow: '0 0 0 4px rgba(142,182,154,0.12)' }} />
                {item}
              </Box>
            ))}
          </Box>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          p: { xs: 4, md: 6, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(14px)'
        }}>
          <Typography variant="h1" sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#17201B', mb: 1 }}>
            Welcome back
          </Typography>
          
          <Typography sx={{ fontSize: '1rem', color: '#66716A', mb: 4 }}>
            Please enter your details to sign in.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} noValidate>
            <Box sx={{ mb: 3 }}>
              <Typography component="label" htmlFor="email" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#17201B', fontSize: '0.875rem' }}>
                Email
              </Typography>
              <TextField
                id="email"
                fullWidth
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FFFFFF' } }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography component="label" htmlFor="password" sx={{ display: 'block', mb: 1, fontWeight: 600, color: '#17201B', fontSize: '0.875rem' }}>
                Password
              </Typography>
              <TextField
                id="password"
                fullWidth
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FFFFFF' } }}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                mb: 3, 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                minHeight: 48,
                bgcolor: '#15803D',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#166534' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Button
                type="button"
                onClick={() => { setResetEmail(credentials.email); setResetMessage(''); setResetOpen(true); }}
                sx={{ color: '#315B42', fontWeight: 600, fontSize: '0.875rem', minHeight: 32, p: 0.5 }}
              >
                Forgot Password?
              </Button>
            </Box>
          </form>
        </Box>

      </Box>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Forgot your password?</DialogTitle>
        <DialogContent>
          {resetError && <Alert severity="error" sx={{ mt: 1, mb: 2 }}>{resetError}</Alert>}
          {resetMessage ? (
            <Box sx={{ pt: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#17201B', mb: 1 }}>Check your email</Typography>
              <Typography variant="body2">{resetMessage}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>For security, we do not reveal whether an account exists for this email.</Typography>
            </Box>
          ) : (
            <Box component="form" id="reset-password-form" onSubmit={handleResetRequest} sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
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
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setResetOpen(false)}>{resetMessage ? 'Back to Sign In' : 'Cancel'}</Button>
          {!resetMessage && <Button variant="contained" type="submit" form="reset-password-form" disabled={resetLoading}>{resetLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
