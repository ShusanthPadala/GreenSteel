import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Alert, Box, Button, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { alertService } from '../../services/alertService';
import { getErrorMessage } from '../../services/api';
import PageHero from '../../components/ui/PageHero';
import TiltCard from '../../components/ui/TiltCard';
import IconOrb from '../../components/ui/IconOrb';
import Loader3D from '../../components/ui/Loader3D';
import { palette as p, headingFont } from '../../styles/tokens';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { useAuth } from '../../contexts/AuthContext';
import { canDo, isDepartmentScoped } from '../../utils/permissions';
import usePlantData, { invalidatePlantData } from '../../hooks/usePlantData';

const isCritical = (severity) => {
  const s = String(severity || '').toLowerCase();
  return s.includes('high') || s === 'critical';
};

export default function Alerts() {
  const reduceMotion = useReducedMotion();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resolving, setResolving] = useState(null);
  const { user } = useAuth();
  const { units } = usePlantData();
  const canResolve = canDo(user, 'alerts', 'resolve');
  const scoped = isDepartmentScoped(user);
  // Department engineers can only resolve alerts raised on their own department's units
  const mayResolve = (item) => {
    if (!canResolve) return false;
    if (!scoped) return true;
    const unit = (units || []).find((u) => String(u.id) === String(item.unitId) || u.unitName === item.unitName);
    return Boolean(unit && unit.departmentName === user?.department);
  };
  const resolve = async (item) => {
    setResolving(item.id); setError(''); setNotice('');
    try {
      await alertService.resolveAlert(item.id);
      setAlerts((list) => list.filter((a) => a.id !== item.id));
      invalidatePlantData();
      setNotice(`${item.pollutant || 'Alert'} on ${item.unitName || 'unit'} marked as resolved.`);
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to resolve this alert.'));
    } finally {
      setResolving(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setAlerts((await alertService.getActiveAlerts()) || []); } catch (e) { setError(getErrorMessage(e, 'Unable to load alerts.')); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { load(); }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const criticalCount = alerts.filter((a) => isCritical(a.severity)).length;
  const stats = [
    { label: 'Active alerts', value: alerts.length, tone: p.primary, icon: <NotificationsActiveOutlinedIcon /> },
    { label: 'Critical / high', value: criticalCount, tone: p.error, icon: <ErrorOutlineIcon /> },
    { label: 'Warnings', value: alerts.length - criticalCount, tone: p.warning, icon: <WarningAmberRoundedIcon /> },
  ];

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pb: 4 }}>
      <PageHero
        eyebrow="Management"
        title="Alerts"
        subtitle="Active environmental alerts from the plant"
        icon={<NotificationsActiveOutlinedIcon />}
        tone={p.warning}
        actions={(
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={load}
            disabled={loading}
            sx={{ minHeight: 44, '& .MuiSvgIcon-root': { transition: 'transform 400ms ease' }, '&:hover .MuiSvgIcon-root': { transform: 'rotate(180deg)' } }}
          >
            Refresh
          </Button>
        )}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice('')} sx={{ mb: 3 }}>{notice}</Alert>}

      {!loading && !error && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 1.5, sm: 2.5 }, mb: 3 }}>
          {stats.map(({ label, value, tone, icon }, idx) => (
            <motion.div key={label} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.06 }}>
              <TiltCard intensity={7}>
                <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, transformStyle: 'preserve-3d', overflow: 'visible' }}>
                  <IconOrb tone={tone} size={46}>{icon}</IconOrb>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>{label}</Typography>
                    <Typography sx={{ fontFamily: headingFont, fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.1, color: tone, letterSpacing: '-0.03em' }}>{value}</Typography>
                  </Box>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </Box>
      )}

      <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {loading ? (
          <Loader3D label="Loading alerts..." minHeight={280} size={36} />
        ) : alerts.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 9, px: 2 }}>
            <Box sx={{ perspective: 400, mb: 2.5 }}><IconOrb size={60} tone={p.success}><VerifiedOutlinedIcon /></IconOrb></Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>No active alerts</Typography>
            <Typography variant="body2" color="text.secondary">The plant has no unresolved environmental alerts.</Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 800, width: '100%' }} aria-label="Active environmental alerts">
              <TableHead>
                <TableRow>
                  {['Unit', 'Pollutant', 'Value', 'Severity', 'Alert time', 'Resolved', ...(canResolve ? ['Action'] : [])].map((heading) => (
                    <TableCell key={heading}>{heading}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((item, index) => {
                  const isLast = index === alerts.length - 1;
                  const critical = isCritical(item.severity);
                  const cellSx = { borderBottom: isLast ? 'none' : '1px solid var(--color-border)' };
                  return (
                    <TableRow
                      hover
                      key={item.id}
                      component={motion.tr}
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.015 }}
                    >
                      <TableCell sx={{ ...cellSx, fontWeight: 650 }}>{item.unitName || item.unitId || '-'}</TableCell>
                      <TableCell sx={cellSx}>{item.pollutant || '-'}</TableCell>
                      <TableCell sx={{ ...cellSx, fontWeight: 650, fontFamily: 'ui-monospace, monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {typeof item.value === 'number' ? item.value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : item.value ?? '-'}
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Chip
                          size="small"
                          label={item.severity || 'Unknown'}
                          sx={{
                            height: 26, fontSize: 11, fontWeight: 700, color: '#fff', border: 'none',
                            background: critical
                              ? 'linear-gradient(180deg, #EF4444, #DC2626 60%, #B91C1C)'
                              : 'linear-gradient(180deg, #F59E0B, #D97706 60%, #B45309)',
                            boxShadow: critical
                              ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 3px 8px -2px rgba(220,38,38,0.5)'
                              : 'inset 0 1px 0 rgba(255,255,255,0.25), 0 3px 8px -2px rgba(217,119,6,0.5)',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ ...cellSx, color: 'text.secondary' }}>{item.alertTime ? new Date(item.alertTime).toLocaleString() : '-'}</TableCell>
                      <TableCell sx={cellSx}>
                        <Typography variant="body2" sx={{ fontWeight: 650, color: item.resolved ? p.success : p.textSecondary }}>{item.resolved ? 'Yes' : 'No'}</Typography>
                      </TableCell>
                      {canResolve && (
                        <TableCell sx={cellSx}>
                          {mayResolve(item) ? (
                            <Button size="small" variant="outlined" startIcon={<TaskAltRoundedIcon />} disabled={resolving === item.id} onClick={() => resolve(item)} sx={{ minHeight: 34, whiteSpace: 'nowrap' }}>
                              {resolving === item.id ? 'Resolving…' : 'Resolve'}
                            </Button>
                          ) : (
                            <Typography variant="body2" sx={{ color: p.textSecondary }}>Other department</Typography>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
}
