import { Box, Card, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import PriorityHighRounded from '@mui/icons-material/PriorityHighRounded';
import IconOrb from '../ui/IconOrb';
import StatusChip from '../ui/StatusChip';
import Skeleton from '../ui/Skeleton';
import { palette as p, headingFont, hoverLift } from '../../styles/tokens';

const fmt = (v, d = 1) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(d) : '—');

// Weights mirror the backend's ESGScoreCalculator exactly
const PILLARS = [
    {
        key: 'environmental', title: 'Environmental', color: '#047857', scoreKey: 'environmentalScore',
        parts: [
            ['Carbon index (avg unit health)', 'carbonFootprint', 40],
            ['Water efficiency', 'waterEfficiency', 20],
            ['Waste recycled', 'wasteRecycling', 20],
            ['Renewable energy', 'renewableEnergy', 20],
        ],
    },
    {
        key: 'social', title: 'Social', color: '#0E7490', scoreKey: 'socialScore',
        parts: [['Employee safety', 'employeeSafety', 60], ['Training hours', 'trainingHours', 40]],
    },
    {
        key: 'governance', title: 'Governance', color: '#B45309', scoreKey: 'governanceScore',
        parts: [['Board compliance', 'boardCompliance', 60], ['Sustainability index', 'sustainabilityIndex', 40]],
    },
];

function Bar({ value, color, max = 100 }) {
    const pct = typeof value === 'number' ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
    return (
        <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'rgba(15,23,42,0.06)', overflow: 'hidden' }}>
            <Box sx={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}99, ${color})`, transition: 'width 600ms ease' }} />
        </Box>
    );
}

/** "How the score is calculated" — live values from the ESG endpoints. */
export function ScoreFormula({ data }) {
    return (
        <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.75, mb: 1 }}>
                <IconOrb size={42}><CalculateOutlined /></IconOrb>
                <Box>
                    <Typography variant="h3">How the ESG score is calculated</Typography>
                    <Typography variant="body2">Overall ESG = (Environmental + Social + Governance) ÷ 3 = <b style={{ color: p.text }}>{fmt(data?.overallScore)}</b></Typography>
                </Box>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
                {PILLARS.map((pl) => (
                    <Box key={pl.key} sx={{ p: 2, borderRadius: '16px', border: `1px solid ${p.border}`, bgcolor: '#fff', ...hoverLift }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 800, color: pl.color }}>{pl.title}</Typography>
                            <Typography sx={{ fontFamily: headingFont, fontWeight: 800, fontSize: '1.3rem', color: pl.color }}>{fmt(data?.[pl.scoreKey])}</Typography>
                        </Stack>
                        <Stack sx={{ gap: 1.25 }}>
                            {pl.parts.map(([label, key, weight]) => {
                                const v = data?.[pl.key]?.[key];
                                return (
                                    <Box key={key}>
                                        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: p.textSecondary }}>
                                                <Box component="span" sx={{ display: 'inline-block', minWidth: 34, fontWeight: 800, color: pl.color }}>{weight}%</Box>{label}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{fmt(v)}</Typography>
                                        </Stack>
                                        <Bar value={v} color={pl.color} />
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                ))}
            </Box>
        </Card>
    );
}

/** Each department's share in plant health, efficiency and limit breaches. */
export function DepartmentContribution({ analysis, loading }) {
    const depts = Object.values(analysis?.departments || {}).sort((a, b) => (b.breaches - a.breaches) || ((a.healthScore ?? 100) - (b.healthScore ?? 100)));
    const total = analysis?.totalBreaches || 0;
    return (
        <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.75, mb: 2 }}>
                <IconOrb size={42} tone="#0E7490"><ApartmentOutlined /></IconOrb>
                <Box>
                    <Typography variant="h3">Department contribution</Typography>
                    <Typography variant="body2">Average unit health drives the ESG carbon index; average efficiency is the plant sustainability score.</Typography>
                </Box>
            </Stack>
            {loading && !analysis ? <Skeleton height={200} /> : depts.length === 0 ? <Typography variant="body2">No unit data yet.</Typography> : (
                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 620 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Department</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell sx={{ width: '22%' }}>Avg health</TableCell>
                                <TableCell sx={{ width: '22%' }}>Avg efficiency</TableCell>
                                <TableCell align="right">Share of breaches</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {depts.map((d) => (
                                <TableRow key={d.name} hover>
                                    <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{d.name}</TableCell>
                                    <TableCell><StatusChip status={d.status} size="sm" /></TableCell>
                                    <TableCell>
                                        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ flex: 1 }}><Bar value={d.healthScore} color="#047857" /></Box>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 800, minWidth: 36, textAlign: 'right' }}>{fmt(d.healthScore)}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ flex: 1 }}><Bar value={d.efficiency} color="#0D9488" /></Box>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 800, minWidth: 36, textAlign: 'right' }}>{fmt(d.efficiency)}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: d.breaches ? p.error : p.success, whiteSpace: 'nowrap' }}>
                                        {total ? `${Math.round((d.breaches / total) * 100)}%` : '0%'} <Box component="span" sx={{ color: p.textSecondary, fontWeight: 600 }}>({d.breaches})</Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Card>
    );
}

const reasonFor = (u) => {
    const r = [];
    if (u.breaches) r.push(`${u.breaches} limit breach${u.breaches > 1 ? 'es' : ''}`);
    if (u.alerts.length) r.push(`${u.alerts.length} active alert${u.alerts.length > 1 ? 's' : ''}`);
    if (u.healthScore !== null && u.healthScore < 75) r.push(`health ${fmt(u.healthScore, 0)}`);
    const rising = Object.entries(u.trends).filter(([, t]) => t.changePct > 0.5).map(([k]) => k.toUpperCase().replace('X', 'x'));
    if (rising.length) r.push(`rising ${rising.join(', ')}`);
    return r.join(' · ') || 'Near limits';
};

/** Units most worth fixing first, with the reason. */
export function FixFirst({ analysis, loading }) {
    const list = analysis?.priorities || [];
    return (
        <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.75, mb: 2 }}>
                <IconOrb size={42} tone="#DC2626"><PriorityHighRounded /></IconOrb>
                <Box>
                    <Typography variant="h3">What to fix first</Typography>
                    <Typography variant="body2">Units with the most limit breaches, alerts and lowest health.</Typography>
                </Box>
            </Stack>
            {loading && !analysis ? <Skeleton height={160} /> : list.length === 0 ? (
                <Typography variant="body2" sx={{ color: p.success, fontWeight: 700 }}>All units are within limits.</Typography>
            ) : (
                <Stack sx={{ gap: 1 }}>
                    {list.map((u, i) => (
                        <Tooltip key={u.unit.id} title={u.unit.departmentName || ''} placement="left">
                            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, p: 1.25, borderRadius: '12px', border: `1px solid ${p.border}`, bgcolor: '#fff', ...hoverLift }}>
                                <Box sx={{ width: 28, height: 28, borderRadius: '9px', display: 'grid', placeItems: 'center', bgcolor: i === 0 ? p.error : 'rgba(15,23,42,0.06)', color: i === 0 ? '#fff' : p.text, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</Box>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography noWrap sx={{ fontWeight: 700, fontSize: 14 }}>{u.unit.unitName}</Typography>
                                    <Typography noWrap sx={{ fontSize: 12, color: p.textSecondary }}>{reasonFor(u)}</Typography>
                                </Box>
                                <StatusChip status={u.status} size="sm" />
                            </Stack>
                        </Tooltip>
                    ))}
                </Stack>
            )}
        </Card>
    );
}
