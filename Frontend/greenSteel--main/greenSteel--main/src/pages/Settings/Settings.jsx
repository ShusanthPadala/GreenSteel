import { Alert, Avatar, Box, Card, CardContent, Stack, Typography, Chip } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { MdSettings } from 'react-icons/md';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { useAuth } from '../../contexts/AuthContext';
import PageHero from '../../components/ui/PageHero';
import { palette as p, headingFont, hoverLift } from '../../styles/tokens';

export default function Settings() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase() || 'GS';

  const rows = [
    ['Name', user ? `${user.firstName} ${user.lastName}` : '-', <PersonOutlineIcon key="i" />],
    ['Employee code', user?.employeeCode, <BadgeOutlinedIcon key="i" />],
    ['Email', user?.email, <EmailOutlinedIcon key="i" />],
    ['Role', user?.role, <AdminPanelSettingsOutlinedIcon key="i" />],
    ['Department', user?.department, <ApartmentOutlinedIcon key="i" />],
  ];

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      <PageHero eyebrow="Management" title="Settings" subtitle="Your GreenSteel account details" icon={<MdSettings />} />

      <Alert severity="info" sx={{ mb: 3 }}>Account settings are managed by your administrator. Direct edits are disabled.</Alert>

      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card sx={{ width: '100%', maxWidth: 880, overflow: 'hidden' }}>
          {/* Header: avatar + title + status, on a soft emerald band */}
          <Box sx={{
            px: { xs: 3, sm: 4 }, py: 3, display: 'flex', alignItems: 'center', gap: 2.25, flexWrap: 'wrap',
            borderBottom: `1px solid ${p.border}`,
            background: `linear-gradient(135deg, ${p.primaryLight} 0%, #F0FDFA 60%, #ECFEFF 100%)`,
          }}>
            <Avatar sx={{
              width: 60, height: 60, fontSize: 21, fontWeight: 800, fontFamily: headingFont, color: '#FFFFFF',
              background: `linear-gradient(145deg, ${p.primary}, ${p.teal})`,
              boxShadow: '0 10px 20px -8px rgba(4,120,87,0.55), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '3px solid #FFFFFF',
            }}>
              {initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography variant="h3" sx={{ mb: 0.25 }}>Profile Overview</Typography>
              <Typography variant="body2" color="text.secondary">Read-only account information</Typography>
            </Box>
            <Chip
              size="small"
              label={user?.status || 'ACTIVE'}
              icon={<span className="gs-live-dot" style={{ marginLeft: 10 }} />}
              sx={{ bgcolor: '#FFFFFF', color: 'primary.main', fontWeight: 700, border: '1px solid rgba(4,120,87,0.2)' }}
            />
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.25 }}>
              {rows.map(([label, item, icon]) => (
                <Stack
                  key={label}
                  direction="row"
                  sx={{
                    alignItems: 'center', gap: 1.75, p: 1.75, borderRadius: '14px',
                    gridColumn: label === 'Email' ? { md: '1 / -1' } : 'auto',
                    bgcolor: '#FFFFFF', border: `1px solid ${p.border}`,
                    ...hoverLift,
                  }}
                >
                  <Box sx={{ width: 38, height: 38, borderRadius: '11px', display: 'grid', placeItems: 'center', bgcolor: p.primaryLight, color: p.primary, flexShrink: 0, '& svg': { fontSize: 19 } }}>
                    {icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.25 }}>{label}</Typography>
                    <Typography sx={{ fontWeight: 650, fontSize: '0.9375rem', overflowWrap: 'anywhere' }}>{item || '-'}</Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
