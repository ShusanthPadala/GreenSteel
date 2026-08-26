import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
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

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, bgcolor: '#EAF3EC' }}>
      <Box sx={{ width: '100%', maxWidth: 480, p: { xs: 3, sm: 5 }, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 24px 70px rgba(10,29,20,0.18)' }}>
        <Typography sx={{ color: '#15803D', fontWeight: 800, mb: 1 }}>GreenSteel</Typography>
        {state.success ? (
          <>
            <Typography variant="h1" sx={{ fontSize: '1.8rem', mb: 1 }}>Password reset successfully</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>You can now sign in with your new password.</Typography>
            <Button component={Link} to="/login" variant="contained" fullWidth>Sign In</Button>
          </>
        ) : (
          <>
            <Typography variant="h1" sx={{ fontSize: '1.8rem', mb: 1 }}>Reset your password</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Choose a new password for your GreenSteel account.</Typography>
            {state.error && <Alert severity="error" sx={{ mb: 2 }}>{state.error}</Alert>}
            <form onSubmit={submit}>
              <TextField fullWidth required type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth required type="password" label="Confirm password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} sx={{ mb: 3 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Use at least 8 characters.</Typography>
              <Button type="submit" variant="contained" fullWidth disabled={state.loading}>
                {state.loading ? <CircularProgress size={22} color="inherit" /> : 'Reset Password'}
              </Button>
            </form>
            <Button onClick={() => navigate('/login')} sx={{ mt: 2 }} fullWidth>Back to Sign In</Button>
          </>
        )}
      </Box>
    </Box>
  );
}
