import { Box, Card, Stack, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import StatusChip from '../ui/StatusChip';
import Sparkline from '../ui/Sparkline';
import RateBadge from './RateBadge';
import Skeleton from '../ui/Skeleton';
import { POLLUTANTS } from '../../constants/plantModel';
import { classify } from '../../utils/emissionAnalytics';
import { statusMeta } from '../../constants/statusMeta';
import { palette as p, headingFont } from '../../styles/tokens';

const fmt = (v) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(1) : '—');

/** Per-unit emission rate cards: latest value vs limit, change rate, 10-reading trend. */
export default function UnitRatePanel({ unitStats = [], limits, loading, title = 'Emission rate by unit' }) {
    const reduceMotion = useReducedMotion();
    if (loading) return <Skeleton height={180} radius={20} sx={{ mb: 3 }} />;
    if (!unitStats.length) return null;
    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5, gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h3">{title}</Typography>
                <Typography variant="body2">
                    Limits: {POLLUTANTS.map((pl) => `${pl.label} ${limits[pl.key]?.limit} ${limits[pl.key]?.unit}`).join(' · ')}
                </Typography>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: 'repeat(3, 1fr)' }, gap: 2 }}>
                {unitStats.map((u, i) => (
                    <motion.div key={u.unit.id} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04 }}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography noWrap sx={{ fontFamily: headingFont, fontWeight: 800, fontSize: 15 }}>{u.unit.unitName}</Typography>
                                    <Typography noWrap sx={{ fontSize: 12, color: p.textSecondary }}>{u.unit.departmentName || '—'}</Typography>
                                </Box>
                                <StatusChip status={u.status} size="sm" />
                            </Stack>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '44px 1fr auto auto', alignItems: 'center', columnGap: 1.25, rowGap: 0.75 }}>
                                {POLLUTANTS.map((pl) => {
                                    const t = u.trends[pl.key];
                                    const s = classify(t.latest, limits[pl.key]?.limit);
                                    const values = u.records.slice(-10).map((r) => r[pl.key]);
                                    return [
                                        <Typography key={`${pl.key}-l`} sx={{ fontSize: 12, fontWeight: 800, color: pl.color }}>{pl.label}</Typography>,
                                        <Sparkline key={`${pl.key}-s`} values={values} color={pl.color} width={110} height={26} limit={limits[pl.key]?.limit} />,
                                        <Typography key={`${pl.key}-v`} sx={{ fontSize: 13, fontWeight: 800, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: s === 'unknown' ? p.textSecondary : statusMeta(s).color }}>{fmt(t.latest)}</Typography>,
                                        <Box key={`${pl.key}-r`} sx={{ minWidth: 52, textAlign: 'right' }}><RateBadge trend={t} unit={limits[pl.key]?.unit} /></Box>,
                                    ];
                                })}
                            </Box>
                        </Card>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
}
