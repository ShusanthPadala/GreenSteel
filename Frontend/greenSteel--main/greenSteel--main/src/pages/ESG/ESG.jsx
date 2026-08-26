import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Card, CardContent, CircularProgress, Stack,
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Chip
} from '@mui/material';
import { Refresh as RefreshIcon, ParkOutlined, GroupOutlined, GavelOutlined, Insights, FactoryOutlined } from '@mui/icons-material';
import { motion, useReducedMotion } from 'framer-motion';
import { esgService } from '../../services/esgService';

// Progressive Radial Score Component
const RadialScore = ({ label, score, color, delay }) => {
  const reduceMotion = useReducedMotion();
  const validScore = typeof score === 'number' && Number.isFinite(score);
  const displayScore = validScore ? score.toFixed(1) : '-';
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = validScore ? circumference - (score / 100) * circumference : circumference;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: delay }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box sx={{ position: 'relative', width: 120, height: 120, display: 'grid', placeItems: 'center', mb: 2 }}>
        <svg pointerEvents="none" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#f0f5f1" strokeWidth="8" />
          {/* Animated Progress */}
          {validScore && (
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
            />
          )}
        </svg>
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: color, fontWeight: 800, lineHeight: 1 }}>{displayScore}</Typography>
          {validScore && <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>/ 100</Typography>}
        </Box>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.primary' }}>
        {label}
      </Typography>
    </motion.div>
  );
};

export default function ESG() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reduceMotion = useReducedMotion();

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
         <CircularProgress size={48} sx={{ mb: 3, color: 'primary.main' }} />
         <Typography variant="h2" sx={{ mb: 1 }}>Analyzing ESG Metrics</Typography>
         <Typography color="text.secondary">Aggregating sustainability data...</Typography>
      </Box>
    );
  }

  const formatValue = (val) => typeof val === 'number' && Number.isFinite(val) ? val.toFixed(1) : 'N/A';
  
  // Notice mapping keys align with backend exactly
  const metricGroups = [
    {
      key: 'environmental', title: 'Environmental', icon: ParkOutlined, color: '#2f5c40',
      metrics: [
        ['carbonFootprint', 'Carbon Footprint', 'tCO₂e'],
        ['waterEfficiency', 'Water Efficiency', 'L/ton'],
        ['wasteRecycling', 'Waste Recycled', '%'], // Adjusted to match backend
        ['renewableEnergy', 'Renewable Energy', '%']
      ]
    },
    {
      key: 'social', title: 'Social', icon: GroupOutlined, color: '#32667a',
      metrics: [
        ['employeeSafety', 'Employee Safety', 'idx'],
        ['trainingHours', 'Training Hours', 'hrs'],
      ]
    },
    {
      key: 'governance', title: 'Governance', icon: GavelOutlined, color: '#8c6014',
      metrics: [
        ['boardCompliance', 'Board Compliance', '%'],
        ['sustainabilityIndex', 'Sustainability Index', 'idx']
      ]
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: 4 }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} gap={2} sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Box>
          <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
            <Insights sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sustainability Performance
            </Typography>
          </Stack>
          <Typography variant="h1" sx={{ mb: 1, fontFamily: '"Manrope", sans-serif' }}>ESG Overview</Typography>
          <Typography variant="body1" color="text.secondary">Environmental, social and governance analytics across the plant.</Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={load}
          disabled={loading}
          sx={{
            minWidth: 112,
            height: 36,
            px: 1.25,
            py: 0,
            borderRadius: 1.5,
            borderColor: '#B8D8C0',
            color: '#15803D',
            bgcolor: '#FFFFFF',
            fontSize: '0.75rem',
            boxShadow: '0 2px 7px rgba(21,128,61,0.08)',
            '& .MuiButton-startIcon': { mr: 0.5 },
            '&:hover': {
              bgcolor: '#EAF6ED',
              borderColor: '#15803D',
              boxShadow: '0 5px 12px rgba(21,128,61,0.14)',
              transform: 'translateY(-1px)',
            }
          }}
        >
          Refresh
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

      {/* Hero Scores */}
      <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: 'none', boxShadow: '0 8px 32px rgba(17,24,20,0.04)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 4, md: 2 } }}>
           <RadialScore label="Overall ESG" score={data?.overallScore} color="#111814" delay={0} />
           <RadialScore label="Environmental" score={data?.environmentalScore} color="#2f5c40" delay={0.1} />
           <RadialScore label="Social" score={data?.socialScore} color="#32667a" delay={0.2} />
           <RadialScore label="Governance" score={data?.governanceScore} color="#8c6014" delay={0.3} />
        </Box>
      </Card>

      {/* Category Sections */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {metricGroups.map((group, groupIndex) => (
          <motion.div key={group.key} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + groupIndex * 0.1 }}>
            <Card sx={{ height: '100%', borderRadius: 2.5, display: 'flex', flexDirection: 'column', border: '1px solid #e5ebe6', position: 'relative', overflow: 'hidden' }}>
              {/* Top color bar */}
              <Box sx={{ height: 4, width: '100%', bgcolor: group.color, position: 'absolute', top: 0, left: 0 }} />
              
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="center" gap={2.5} mb={4} mt={1}>
                  <Box sx={{ p: 1, bgcolor: `${group.color}15`, color: group.color, borderRadius: 1.5, display: 'flex' }}>
                    <group.icon fontSize="medium" />
                  </Box>
                  <Typography variant="h3" sx={{ fontFamily: '"Manrope", sans-serif', color: group.color }}>{group.title}</Typography>
                </Stack>
                
                <Stack spacing={2.5} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                  {group.metrics.map(([key, label, unit]) => {
                    const val = data?.[group.key]?.[key];
                    const isAvailable = typeof val === 'number';
                    
                    return (
                      <Box key={key} sx={{ position: 'relative' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>{label}</Typography>
                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: isAvailable ? '#111814' : '#aab8af', lineHeight: 1 }}>
                            {formatValue(val)}
                          </Typography>
                          {isAvailable && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>{unit}</Typography>
                          )}
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Operational Overview & Alerts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 2fr' }, gap: 3 }}>
        
        {/* Plant Overview */}
        <Card sx={{ borderRadius: 2.5, p: 3, border: '1px solid #e5ebe6', boxShadow: 'none' }}>
          <Stack direction="row" alignItems="center" gap={2.5} mb={3}>
            <Box sx={{ p: 1, bgcolor: '#f0f5f1', color: 'primary.main', borderRadius: 1.5, display: 'flex' }}>
              <FactoryOutlined />
            </Box>
            <Typography variant="h3" sx={{ fontFamily: '"Manrope", sans-serif' }}>Plant Overview</Typography>
          </Stack>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {[
              ['blastFurnaces', 'Blast Furnaces'], 
              ['powerPlants', 'Power Plants'], 
              ['operationalUnits', 'Operational'], 
              ['maintenanceUnits', 'Maintenance'], 
              ['warningUnits', 'Warning'], 
              ['totalUnits', 'Total Units']
            ].map(([key, label]) => (
              <Box key={key} sx={{ p: 2, bgcolor: '#fafcfb', borderRadius: 2, border: '1px solid #edf3ee', transition: 'all 0.2s', '&:hover': { bgcolor: '#ffffff', borderColor: '#d1e6d8', boxShadow: '0 4px 12px rgba(47,92,64,0.05)' } }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#111814' }}>{data?.plantOverview?.[key] ?? '-'}</Typography>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Environmental Alerts */}
        <Card sx={{ borderRadius: 2.5, p: 3, display: 'flex', flexDirection: 'column', border: '1px solid #e5ebe6', boxShadow: 'none' }}>
          <Stack direction="row" alignItems="center" gap={2} sx={{ justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h3" sx={{ mb: 0.5, fontFamily: '"Manrope", sans-serif' }}>Environmental Alerts</Typography>
              <Typography variant="body2" color="text.secondary">Latest readings requiring attention</Typography>
            </Box>
            <Chip label={`${alerts.length} total`} sx={{ fontWeight: 700, bgcolor: '#f4f7f5', color: '#4b5e53' }} />
          </Stack>
          
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {alerts.length === 0 ? (
               <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, bgcolor: '#fafcfb', borderRadius: 2, border: '1px dashed #d1dbd4' }}>
                 <Typography variant="body1" sx={{ fontWeight: 700, color: '#2f5c40', mb: 0.5 }}>No environmental alerts</Typography>
                 <Typography variant="body2" color="text.secondary">The latest plant readings are well within expected safety threshold limits.</Typography>
               </Box>
            ) : (
               <Box sx={{ overflowX: 'auto', mx: -3, px: 3 }}>
                 <Table sx={{ minWidth: 600 }}>
                   <TableHead>
                     <TableRow sx={{ '& th': { borderBottom: '1px solid #e5ebe6', py: 1.5, color: '#637067', fontWeight: 700, fontSize: 12 } }}>
                       <TableCell>Unit</TableCell>
                       <TableCell>Pollutant</TableCell>
                       <TableCell align="right">Recorded Value</TableCell>
                       <TableCell>Severity</TableCell>
                       <TableCell>Resolved</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {alerts.map((item, index) => (
                       <TableRow key={index} hover sx={{ '& td': { borderBottom: '1px solid #f0f5f1', py: 2 } }}>
                         <TableCell sx={{ fontWeight: 600 }}>{item.unitName || item.unitId || '-'}</TableCell>
                         <TableCell sx={{ color: 'text.secondary' }}>{item.pollutant || '-'}</TableCell>
                         <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}>{formatValue(item.value)}</TableCell>
                         <TableCell>
                           <Chip 
                             size="small" 
                             label={item.severity || 'Unknown'} 
                             sx={{ 
                               height: 24, fontSize: 11, fontWeight: 700,
                               bgcolor: item.severity === 'CRITICAL' ? '#fceded' : item.severity === 'WARNING' ? '#fcf3e3' : '#f0f5f1',
                               color: item.severity === 'CRITICAL' ? '#c24141' : item.severity === 'WARNING' ? '#b27b16' : '#4b5e53',
                               border: `1px solid ${item.severity === 'CRITICAL' ? '#f5c6c6' : item.severity === 'WARNING' ? '#f5dfac' : '#d1dbd4'}`
                             }} 
                           />
                         </TableCell>
                         <TableCell>
                           <Typography variant="body2" sx={{ fontWeight: 600, color: item.resolved ? '#1a7a4c' : '#637067' }}>
                             {item.resolved ? 'Yes' : 'No'}
                           </Typography>
                         </TableCell>
                       </TableRow>
                     ))}
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
