import { Alert, Box, Card, CardContent, Stack, Typography, Chip, Divider } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
        <Typography variant="h1" sx={{ mb: 0.5 }}>Settings</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>Your GreenSteel account details</Typography>
      </motion.div>
      <Alert severity="info" sx={{ mb: 3 }}>Account settings are managed by your administrator. Direct edits are disabled.</Alert>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ mb: 0.5 }}>Profile Overview</Typography>
              <Typography variant="body2" color="text.secondary">Read-only account information</Typography>
            </Box>
            <Chip size="small" label={user?.status || 'ACTIVE'} sx={{ bgcolor: 'rgba(53, 94, 69, 0.1)', color: 'primary.main', fontWeight: 600, border: 'none' }} />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={0}>
            {[
              ['Name', user ? `${user.firstName} ${user.lastName}` : '-'], 
              ['Email', user?.email], 
              ['Employee code', user?.employeeCode], 
              ['Role', user?.role], 
              ['Department', user?.department]
            ].map(([label, item]) => (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--color-border)' }}>
                <Typography color="text.secondary" sx={{ minWidth: 160, fontSize: '0.875rem' }}>{label}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{item || '-'}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
