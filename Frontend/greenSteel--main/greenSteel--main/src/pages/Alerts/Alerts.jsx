import { useCallback, useEffect, useState } from 'react';

import { Alert, Box, Card, CardContent, Chip, CircularProgress, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { alertService } from '../../services/alertService';
import { getErrorMessage } from '../../services/api';

export default function Alerts() {
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setAlerts((await alertService.getActiveAlerts()) || []); } catch (e) { setError(getErrorMessage(e, 'Unable to load alerts.')); } finally { setLoading(false); }
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => { load(); }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pb: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start" gap={2} sx={{ mb: 3.5, width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #DDE4DE', pb: 2.25 }}>
        <Box sx={{ minWidth: 0 }}>
           <Typography variant="h1" sx={{ mb: 0.5 }}>Alerts</Typography>
           <Typography variant="body1" color="text.secondary">Active environmental alerts from the plant</Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #DDE4DE', bgcolor: '#FBFCFB' }}>
           <Tooltip title="Refresh alerts">
             <IconButton onClick={load} disabled={loading} sx={{ width: 40, height: 40, border: '1px solid #C9D8CC', borderRadius: 1.5, color: '#3F654B', transition: 'all 180ms ease', '&:hover': { bgcolor: '#EAF1EB', transform: 'translateY(-1px)' } }}>
               <RefreshIcon fontSize="small" sx={{ color: 'var(--color-text-main)' }} />
             </IconButton>
           </Tooltip>
        </Box>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                 <CircularProgress size={32} sx={{ mb: 1, color: 'primary.main' }} />
                 <Typography variant="body2" sx={{ fontWeight: 600 }}>Loading alerts...</Typography>
             </Box>
          ) : alerts.length === 0 ? (
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                 <Typography variant="h3" sx={{ mb: 0.5 }}>No active alerts</Typography>
                 <Typography variant="body2" color="text.secondary">The plant has no unresolved environmental alerts.</Typography>
             </Box>
          ) : (
             <Box sx={{ overflowX: 'auto', width: '100%' }}>
                 <Table sx={{ minWidth: 800, width: '100%' }} aria-label="Active environmental alerts">
                     <TableHead>
                         <TableRow>
                             {['Unit', 'Pollutant', 'Value', 'Severity', 'Alert time', 'Resolved'].map((heading) => (
                                 <TableCell key={heading}>{heading}</TableCell>
                             ))}
                         </TableRow>
                     </TableHead>
                     <TableBody>
                         {alerts.map((item, index) => {
                             const isLast = index === alerts.length - 1;
                             return (
                             <TableRow hover key={item.id}>
                                 <TableCell sx={{ fontWeight: 500, borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>{item.unitName || item.unitId || '-'}</TableCell>
                                 <TableCell sx={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>{item.pollutant || '-'}</TableCell>
                                 <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>
                                     {typeof item.value === 'number' ? item.value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : item.value ?? '-'}
                                 </TableCell>
                                 <TableCell sx={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>
                                     <Chip 
                                       size="small" 
                                       label={item.severity || 'Unknown'} 
                                       sx={{ 
                                          height: 24, fontSize: 11, fontWeight: 600, 
                                          bgcolor: String(item.severity || '').toLowerCase().includes('high') || String(item.severity || '').toLowerCase() === 'critical' ? 'var(--color-error)' : 'var(--color-warning)', 
                                          color: '#fff',
                                          border: 'none'
                                       }}
                                     />
                                 </TableCell>
                                 <TableCell sx={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>{item.alertTime ? new Date(item.alertTime).toLocaleString() : '-'}</TableCell>
                                 <TableCell sx={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>{item.resolved ? 'Yes' : 'No'}</TableCell>
                             </TableRow>
                             );
                         })}
                     </TableBody>
                 </Table>
             </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
