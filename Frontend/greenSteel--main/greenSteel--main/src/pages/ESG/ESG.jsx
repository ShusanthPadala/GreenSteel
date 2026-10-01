import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Card, CardContent, Stack,
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Chip
} from '@mui/material';
import { Refresh as RefreshIcon, ParkOutlined, GroupOutlined, GavelOutlined, Insights, FactoryOutlined, WarningAmberRounded, CheckCircleOutlined } from '@mui/icons-material';
import { motion, useReducedMotion } from 'framer-motion';
import { esgService } from '../../services/esgService';
import TiltCard from '../../components/ui/TiltCard';
import IconOrb from '../../components/ui/IconOrb';
import PageHero from '../../components/ui/PageHero';
import Loader3D from '../../components/ui/Loader3D';
import { headingFont, hoverLift } from '../../styles/tokens';
import usePlantData from '../../hooks/usePlantData';
import { ScoreFormula, DepartmentContribution, FixFirst } from '../../components/emissions/ScoreBreakdown';

// Progressive Radial Score Component — 3D ring with glow
const RadialScore = ({ label, score, color, delay }) => {
  const reduceMotion = useReducedMotion();
  const validScore = typeof score === 'number' && Number.isFinite(score);
  const displayScore = validScore ? score.toFixed(1) : '-';
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = validScore ? circumference - (score / 100) * circumference : circumference;
  const gradId = `esg-grad-${label.replace(/\s+/g, '-')}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.5 }}
      style={{ height: '100%' }}
    >
      <TiltCard intensity={10}>
        <Card sx={{ height: '100%', p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', transformStyle: 'preserve-3d', overflow: 'visible' }}>
          <Box sx={{ position: 'relative', width: 132, height: 132, display: 'grid', placeItems: 'center', mb: 2, transform: 'translateZ(28px)' }}>
            {/* raised disc behind ring */}
            <Box aria-hidden sx={{ position: 'absolute', inset: 14, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFFFFF, #F1F5F9 70%)', boxShadow: `inset 0 -4px 10px rgba(15,23,42,0.06), 0 10px 24px -10px ${color}66` }} />
            <svg pointerEvents="none" width="132" height="132" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', position: 'relative', filter: `drop-shadow(0 4px 8px ${color}55)` }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="9" />
              {/* Animated Progress */}
              {validScore && (
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={`url(#${gradId})`}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={reduceMotion ? false : { strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
                />
              )}
            </svg>
            <Box sx={{ position: 'absolute', textAlign: 'center' }}>
              <Typography sx={{ fontFamily: headingFont, fontSize: '1.6rem', color: color, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>{displayScore}</Typography>
              {validScore && <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem' }}>/ 100</Typography>}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.primary', fontSize: '0.74rem' }}>
            {label}
          </Typography>
        </Card>
      </TiltCard>
    </motion.div>
  );
};

export default function ESG() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reduceMotion = useReducedMotion();
  const plant = usePlantData();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [dashboard, environmental, social, governance, environmentalAlerts] = await Promise.all([
        esgService.getDashboard(),
        esgService.getEnvironmentalMetrics(),
        esgService.getSocialMetrics(),
        esgService.getGovernanceMetrics(),
        esgService.getEnvironmentalAlerts(),
      ]);
      const dashboardData = dashboard || {};
      const environmentalData = environmental || dashboardData.environmental || {};
      const socialData = social || dashboardData.social || {};
      const governanceData = governance || dashboardData.governance || {};
      setData({
        ...dashboardData,
        environmentalScore: dashboardData.environmentalScore ?? environmentalData.environmentalScore,
        socialScore: dashboardData.socialScore ?? socialData.socialScore,
        governanceScore: dashboardData.governanceScore ?? governanceData.governanceScore,
        overallScore: dashboardData.overallScore,
        environmental: environmentalData,
        social: socialData,
        governance: governanceData,
      });
      setAlerts(environmentalAlerts || []);
    } catch {
      setError('Unable to load ESG metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { load(); }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  if (loading) {
    return (
      <Loader3D label="Analyzing ESG Metrics" sublabel="Aggregating sustainability data..." minHeight="60vh" />
    );
  }

  const formatValue = (val) => typeof val === 'number' && Number.isFinite(val) ? val.toFixed(1) : 'N/A';
  
  // Notice mapping keys align with backend exactly
  const metricGroups = [
    {
      key: 'environmental', title: 'Environmental', icon: ParkOutlined, color: '#047857',
      metrics: [
        ['carbonFootprint', 'Carbon Footprint', 'tCO₂e'],
        ['waterEfficiency', 'Water Efficiency', 'L/ton'],
        ['wasteRecycling', 'Waste Recycled', '%'], // Adjusted to match backend
        ['renewableEnergy', 'Renewable Energy', '%']
      ]
    },
    {
      key: 'social', title: 'Social', icon: GroupOutlined, color: '#0E7490',
      metrics: [
        ['employeeSafety', 'Employee Safety', 'idx'],
        ['trainingHours', 'Training Hours', 'hrs'],
      ]
    },
    {
      key: 'governance', title: 'Governance', icon: GavelOutlined, color: '#B45309',
      metrics: [
        ['boardCompliance', 'Board Compliance', '%'],
        ['sustainabilityIndex', 'Sustainability Index', 'idx']
      ]
    }
  ];

  const severityTone = (sev) => (sev === 'CRITICAL'
    ? { bg: '#FEF2F2', fg: '#B91C1C', border: '#FECACA' }
    : sev === 'WARNING'
      ? { bg: '#FFFBEB', fg: '#B45309', border: '#FDE68A' }
      : { bg: '#F1F5F9', fg: '#334155', border: '#CBD5E1' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 3.5 }, pb: 4 }}>
      <PageHero
        eyebrow="Sustainability Performance"
        title="ESG Overview"
        subtitle="Environmental, social and governance analytics across the plant."
        icon={<Insights />}
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

      {error && <Alert severity="error">{error}</Alert>}

      {/* Hero Scores */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 2.5 } }}>
        <RadialScore label="Overall ESG" score={data?.overallScore} color="#064E3B" delay={0} />
        <RadialScore label="Environmental" score={data?.environmentalScore} color="#047857" delay={0.1} />
        <RadialScore label="Social" score={data?.socialScore} color="#0E7490" delay={0.2} />
        <RadialScore label="Governance" score={data?.governanceScore} color="#B45309" delay={0.3} />
      </Box>

      {/* Category Sections */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
        {metricGroups.map((group, groupIndex) => (
          <motion.div key={group.key} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + groupIndex * 0.1 }} style={{ height: '100%' }}>
            <TiltCard intensity={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', transformStyle: 'preserve-3d' }}>
                {/* Top colour band */}
                <Box sx={{ height: 5, width: '100%', background: `linear-gradient(90deg, ${group.color}, ${group.color}55)` }} />
                <Box aria-hidden sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', top: -100, right: -80, background: `radial-gradient(circle, ${group.color}1F, transparent 70%)`, pointerEvents: 'none' }} />

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <Stack direction="row" sx={{ gap: 1.75, mb: 3, alignItems: "center" }}>
                    <IconOrb tone={group.color} size={44}><group.icon /></IconOrb>
                    <Typography variant="h3" sx={{ color: group.color }}>{group.title}</Typography>
                  </Stack>

                  <Stack spacing={1.25} sx={{ flexGrow: 1 }}>
                    {group.metrics.map(([key, label, unit]) => {
                      const val = data?.[group.key]?.[key];
                      const isAvailable = typeof val === 'number';

                      return (
                        <Box key={key} sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'rgba(246,248,250,0.7)', border: '1px solid rgba(226,232,240,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, ...hoverLift }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "baseline", flexShrink: 0 }}>
                            <Typography sx={{ fontFamily: headingFont, fontWeight: 800, fontSize: '1.35rem', color: isAvailable ? '#0F172A' : '#94A3B8', lineHeight: 1, letterSpacing: '-0.02em' }}>
                              {formatValue(val)}
                            </Typography>
                            {isAvailable && (
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem' }}>{unit}</Typography>
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </Box>

      {/* Score breakdown — how the numbers are built and where to act */}
      <ScoreFormula data={data} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.6fr 1fr' }, gap: 2.5 }}>
        <DepartmentContribution analysis={plant.analysis} loading={plant.loading} />
        <FixFirst analysis={plant.analysis} loading={plant.loading} />
      </Box>

      {/* Operational Overview & Alerts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 2fr' }, gap: 2.5 }}>

        {/* Plant Overview */}
        <Card sx={{ p: 3 }}>
          <Stack direction="row" sx={{ gap: 1.75, mb: 3, alignItems: "center" }}>
            <IconOrb size={44}><FactoryOutlined /></IconOrb>
            <Typography variant="h3">Plant Overview</Typography>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
            {[
              ['blastFurnaces', 'Blast Furnaces'],
              ['powerPlants', 'Power Plants'],
              ['operationalUnits', 'Operational'],
              ['maintenanceUnits', 'Maintenance'],
              ['warningUnits', 'Warning'],
              ['totalUnits', 'Total Units']
            ].map(([key, label]) => (
              <Box key={key} sx={{ p: 2, borderRadius: '14px', background: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)', border: '1px solid #E2E8F0', boxShadow: 'inset 0 1px 0 #fff, 0 2px 0 rgba(15,23,42,0.03)', transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease', '&:hover': { borderColor: '#CBD5E1', transform: 'translateY(-3px)', boxShadow: '0 12px 20px -10px rgba(6,78,59,0.25)' } }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.75 }}>{label}</Typography>
                <Typography sx={{ fontFamily: headingFont, fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.03em' }}>{data?.plantOverview?.[key] ?? '-'}</Typography>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Environmental Alerts */}
        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" sx={{ gap: 2, alignItems: "center", justifyContent: 'space-between', mb: 3 }}>
            <Stack direction="row" sx={{ gap: 1.75, alignItems: "center" }}>
              <IconOrb size={44} tone="#D97706"><WarningAmberRounded /></IconOrb>
              <Box>
                <Typography variant="h3" sx={{ mb: 0.25 }}>Environmental Alerts</Typography>
                <Typography variant="body2" color="text.secondary">Latest readings requiring attention</Typography>
              </Box>
            </Stack>
            <Chip label={`${alerts.length} total`} sx={{ fontWeight: 700, bgcolor: '#ECFDF5', color: '#047857', border: '1px solid rgba(4,120,87,0.15)' }} />
          </Stack>

          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {alerts.length === 0 ? (
               <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 6, px: 2, background: 'linear-gradient(180deg, rgba(236,253,245,0.5), rgba(246,248,250,0.3))', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                 <Box sx={{ perspective: 400, mb: 2 }}><IconOrb size={52} tone="#059669"><CheckCircleOutlined /></IconOrb></Box>
                 <Typography variant="body1" sx={{ fontWeight: 700, color: '#047857', mb: 0.5 }}>No environmental alerts</Typography>
                 <Typography variant="body2" color="text.secondary">The latest plant readings are well within expected safety threshold limits.</Typography>
               </Box>
            ) : (
               <Box sx={{ overflowX: 'auto', mx: -3, px: 3 }}>
                 <Table sx={{ minWidth: 600 }}>
                   <TableHead>
                     <TableRow>
                       <TableCell>Unit</TableCell>
                       <TableCell>Pollutant</TableCell>
                       <TableCell align="right">Recorded Value</TableCell>
                       <TableCell>Severity</TableCell>
                       <TableCell>Resolved</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {alerts.map((item, index) => {
                       const tone = severityTone(item.severity);
                       return (
                       <TableRow key={index} hover>
                         <TableCell sx={{ fontWeight: 650 }}>{item.unitName || item.unitId || '-'}</TableCell>
                         <TableCell sx={{ color: 'text.secondary' }}>{item.pollutant || '-'}</TableCell>
                         <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'ui-monospace, monospace', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{formatValue(item.value)}</TableCell>
                         <TableCell>
                           <Chip
                             size="small"
                             label={item.severity || 'Unknown'}
                             icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tone.fg, ml: '8px !important', mr: '-2px !important' }} />}
                             sx={{ height: 26, fontSize: 11, fontWeight: 700, bgcolor: tone.bg, color: tone.fg, border: `1px solid ${tone.border}` }}
                           />
                         </TableCell>
                         <TableCell>
                           <Typography variant="body2" sx={{ fontWeight: 650, color: item.resolved ? '#047857' : '#475569' }}>
                             {item.resolved ? 'Yes' : 'No'}
                           </Typography>
                         </TableCell>
                       </TableRow>
                       );
                     })}
                   </TableBody>
                 </Table>
               </Box>
            )}
          </Box>
        </Card>

      </Box>
    </Box>
  );
}
