import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, Stack, Typography } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import HubOutlined from '@mui/icons-material/HubOutlined';
import FactoryOutlined from '@mui/icons-material/FactoryOutlined';
import ReportGmailerrorredOutlined from '@mui/icons-material/ReportGmailerrorredOutlined';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import IconOrb from '../ui/IconOrb';
import StatusChip from '../ui/StatusChip';
import Skeleton from '../ui/Skeleton';
import RateBadge from '../emissions/RateBadge';
import { FixFirst } from '../emissions/ScoreBreakdown';
import { POLLUTANTS, ROLE_NODE } from '../../constants/plantModel';
import { downstreamOf, upstreamOf, classify } from '../../utils/emissionAnalytics';
import { statusMeta } from '../../constants/statusMeta';
import { palette as p, headingFont, hoverLift } from '../../styles/tokens';

const fmt = (v) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(1) : '—');
const OFFICER_ROLES = ['SUPER_ADMIN', 'PLANT_ADMIN', 'PRODUCTION_MANAGER', 'ENVIRONMENTAL_OFFICER', 'ESG_OFFICER', 'QUALITY_ENGINEER'];

/** Every department as a compact status tile; click opens the plant map. */
function PlantStrip({ nodes }) {
    const navigate = useNavigate();
    return (
        <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                    <IconOrb size={40}><HubOutlined /></IconOrb>
                    <Typography variant="h3">Plant at a glance</Typography>
                </Stack>
                <Button endIcon={<ArrowForwardRounded />} onClick={() => navigate('/plant-map')} sx={{ color: p.primary }}>Open gas flow map</Button>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 1.25 }}>
                {nodes.map((n) => {
                    const m = statusMeta(n.status);
                    return (
                        <Box key={n.id} component="button" type="button" onClick={() => navigate('/plant-map')} sx={{
                            textAlign: 'left', font: 'inherit', cursor: 'pointer', p: 1.5, borderRadius: '14px', bgcolor: '#fff',
                            border: `1px solid ${m.border}`, position: 'relative', overflow: 'hidden', ...hoverLift,
                        }}>
                            <Box aria-hidden sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: m.color }} />
                            <Typography noWrap sx={{ fontWeight: 800, fontSize: 13.5, color: p.text }}>{n.label}</Typography>
                            <Typography noWrap sx={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.label}</Typography>
                            <Typography noWrap sx={{ fontSize: 11.5, color: p.textSecondary }}>
                                {n.dept ? `${n.dept.units.length} unit${n.dept.units.length === 1 ? '' : 's'} · ${n.dept.breaches} breach${n.dept.breaches === 1 ? '' : 'es'}` : 'No units'}
                            </Typography>
                            {n.upstreamRisk.length > 0 && <Typography noWrap sx={{ fontSize: 11, fontWeight: 700, color: '#B45309' }}>⚠ Upstream risk</Typography>}
                        </Box>
                    );
                })}
            </Box>
        </Card>
    );
}

/** Department engineer view: my units, my rates, and the departments linked to mine. */
function MyDepartment({ node, limits }) {
    const navigate = useNavigate();
    const units = node?.dept?.units || [];
    const labelOf = (id, nodes) => nodes.find((x) => x.id === id)?.label || id;
    return (
        <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                    <IconOrb size={44}><FactoryOutlined /></IconOrb>
                    <Box>
                        <Typography variant="h3">Your department · {node.label}</Typography>
                        <Typography variant="body2">{node.role}</Typography>
                    </Box>
                </Stack>
                <StatusChip status={node.status} />
            </Stack>

            {node.upstreamRisk.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {node.upstreamRisk.map((r) => `${labelOf(r.from, node.allNodes)} (${r.label})`).join(', ')} {node.upstreamRisk.length > 1 ? 'are' : 'is'} near or over limits upstream of you — expect higher emissions and coordinate with {node.upstreamRisk.length > 1 ? 'those departments' : 'that department'}.
                </Alert>
            )}

            {units.length === 0 ? (
                <Alert severity="info">No units are linked to your department yet.</Alert>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
                    {units.map((u) => (
                        <Box key={u.unit.id} sx={{ p: 1.75, borderRadius: '14px', border: `1px solid ${p.border}`, bgcolor: '#fff', ...hoverLift }}>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography sx={{ fontFamily: headingFont, fontWeight: 800 }}>{u.unit.unitName}</Typography>
                                <StatusChip status={u.status} size="sm" />
                            </Stack>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                                {POLLUTANTS.map((pl) => {
                                    const t = u.trends[pl.key];
                                    const s = classify(t.latest, limits[pl.key]?.limit);
                                    return (
                                        <Box key={pl.key}>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, color: pl.color }}>{pl.label}</Typography>
                                            <Typography sx={{ fontSize: 15, fontWeight: 800, color: s === 'unknown' ? p.textSecondary : statusMeta(s).color, fontVariantNumeric: 'tabular-nums' }}>{fmt(t.latest)}</Typography>
                                            <RateBadge trend={t} unit={limits[pl.key]?.unit} />
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                {[['Receives from', upstreamOf(node.id), 'from'], ['Sends to', downstreamOf(node.id), 'to']].map(([title, flows, side]) => (
                    <Box key={title} sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'rgba(246,248,250,0.8)', border: `1px solid ${p.border}` }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 800, color: p.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>{title}</Typography>
                        <Stack sx={{ gap: 0.75 }}>
                            {flows.length === 0 ? <Typography variant="body2">—</Typography> : flows.map((f) => {
                                const other = node.allNodes.find((x) => x.id === f[side]);
                                return (
                                    <Stack key={`${f.from}-${f.to}`} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                        <Typography sx={{ fontSize: 13.5, fontWeight: 650 }}>{other?.label} <Box component="span" sx={{ color: p.textSecondary, fontWeight: 500 }}>· {f.label}</Box></Typography>
                                        <StatusChip status={other?.status} size="sm" />
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Box>
                ))}
            </Box>
            <Button endIcon={<ArrowForwardRounded />} onClick={() => navigate('/emission-records')} sx={{ mt: 2, color: p.primary }}>Record emissions</Button>
        </Card>
    );
}

/** Breach counts per pollutant (officer view). */
function BreachSummary({ analysis, limits }) {
    return (
        <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
                <IconOrb size={40} tone="#DC2626"><ReportGmailerrorredOutlined /></IconOrb>
                <Box>
                    <Typography variant="h3">Limit breaches</Typography>
                    <Typography variant="body2">Readings at or above the allowed limit, all time</Typography>
                </Box>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25 }}>
                {POLLUTANTS.map((pl) => {
                    const n = analysis.breachesByPollutant[pl.key] || 0;
                    return (
                        <Box key={pl.key} sx={{ p: 1.5, borderRadius: '14px', border: `1px solid ${n ? 'rgba(220,38,38,0.25)' : p.border}`, bgcolor: n ? 'rgba(220,38,38,0.04)' : '#fff', ...hoverLift }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: pl.color }}>{pl.label} <Box component="span" sx={{ color: p.textSecondary, fontWeight: 600 }}>limit {limits[pl.key]?.limit} {limits[pl.key]?.unit}</Box></Typography>
                            <Typography sx={{ fontFamily: headingFont, fontSize: '1.6rem', fontWeight: 800, color: n ? p.error : p.success }}>{n}</Typography>
                        </Box>
                    );
                })}
            </Box>
        </Card>
    );
}

/** Maintenance view: units needing attention. */
function MaintenanceList({ analysis }) {
    const units = analysis.unitStats.filter((u) => ['MAINTENANCE', 'WARNING'].includes(u.unit.status) || (u.healthScore !== null && u.healthScore < 75));
    return (
        <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
                <IconOrb size={40} tone="#0E7490"><BuildOutlined /></IconOrb>
                <Typography variant="h3">Units needing attention</Typography>
            </Stack>
            {units.length === 0 ? <Typography variant="body2" sx={{ color: p.success, fontWeight: 700 }}>No units need maintenance right now.</Typography> : (
                <Stack sx={{ gap: 1 }}>
                    {units.map((u) => (
                        <Stack key={u.unit.id} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.25, borderRadius: '12px', border: `1px solid ${p.border}`, ...hoverLift }}>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{u.unit.unitName}</Typography>
                                <Typography sx={{ fontSize: 12, color: p.textSecondary }}>{u.unit.departmentName} · health {fmt(u.healthScore)} · {String(u.unit.status || '').toLowerCase()}</Typography>
                            </Box>
                            <StatusChip status={u.status} size="sm" />
                        </Stack>
                    ))}
                </Stack>
            )}
        </Card>
    );
}

/**
 * The part of the dashboard that changes with the user's role.
 * Engineers see their own department and its gas links; officers and
 * managers see the whole plant, breaches and priorities.
 */
export default function RoleInsights({ user, plant }) {
    const { analysis, limits, loading } = plant;
    if (loading && !analysis) return <Skeleton height={220} radius={20} />;
    if (!analysis) return null;
    const role = String(user?.role || '').toUpperCase();
    const nodes = analysis.nodes.map((n, _, all) => ({ ...n, allNodes: all }));
    const myNode = nodes.find((n) => n.id === ROLE_NODE[role]);

    if (myNode) {
        return (
            <Stack sx={{ gap: { xs: 3, md: 3.5 } }}>
                <MyDepartment node={myNode} limits={limits} />
                <PlantStrip nodes={nodes} />
            </Stack>
        );
    }
    if (role === 'MAINTENANCE_ENGINEER') {
        return (
            <Stack sx={{ gap: { xs: 3, md: 3.5 } }}>
                <MaintenanceList analysis={analysis} />
                <PlantStrip nodes={nodes} />
            </Stack>
        );
    }
    if (role === 'SAFETY_OFFICER') {
        return (
            <Stack sx={{ gap: { xs: 3, md: 3.5 } }}>
                <PlantStrip nodes={nodes} />
                <FixFirst analysis={analysis} loading={loading} />
            </Stack>
        );
    }
    if (OFFICER_ROLES.includes(role)) {
        return (
            <Stack sx={{ gap: { xs: 3, md: 3.5 } }}>
                <PlantStrip nodes={nodes} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
                    <BreachSummary analysis={analysis} limits={limits} />
                    <FixFirst analysis={analysis} loading={loading} />
                </Box>
            </Stack>
        );
    }
    return <PlantStrip nodes={nodes} />;
}
