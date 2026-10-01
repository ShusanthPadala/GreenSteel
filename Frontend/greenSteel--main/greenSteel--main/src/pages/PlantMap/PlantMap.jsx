import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { MdHub } from 'react-icons/md';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import StatusChip from '../../components/ui/StatusChip';
import Skeleton from '../../components/ui/Skeleton';
import PlantFlowMap from '../../components/plant/PlantFlowMap';
import usePlantData from '../../hooks/usePlantData';
import { useAuth } from '../../contexts/AuthContext';
import dashboardService from '../../services/dashboardService';
import { downstreamOf, upstreamOf, classify, STATUS_RANK } from '../../utils/emissionAnalytics';
import { POLLUTANTS, ROLE_NODE } from '../../constants/plantModel';
import { STATUS_META, statusMeta } from '../../constants/statusMeta';
import { palette as p, headingFont, hoverLift } from '../../styles/tokens';

const fmt = (v, d = 1) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(d) : '—');

function Stat({ label, value, tone = p.text }) {
    return (
        <Box sx={{ p: 1.5, borderRadius: '14px', border: `1px solid ${p.border}`, bgcolor: '#fff', ...hoverLift }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: p.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</Typography>
            <Typography sx={{ fontFamily: headingFont, fontSize: '1.35rem', fontWeight: 800, color: tone, lineHeight: 1.2 }}>{value}</Typography>
        </Box>
    );
}

export default function PlantMap() {
    const { user } = useAuth();
    const reduceMotion = useReducedMotion();
    const { loading, error, analysis, departments, limits, reload } = usePlantData();
    const myNode = ROLE_NODE[String(user?.role || '').toUpperCase()] || null;
    const [selectedId, setSelectedId] = useState(null);
    const [deptDash, setDeptDash] = useState({ id: null, data: null, loading: false });

    const nodes = useMemo(() => analysis?.nodes || [], [analysis]);
    // Default focus: your own department, otherwise the department in the worst state
    const worstNode = [...nodes].sort((a, b) => (STATUS_RANK[b.status] ?? 0) - (STATUS_RANK[a.status] ?? 0))[0];
    const activeId = selectedId || myNode || worstNode?.id;
    const node = nodes.find((n) => n.id === activeId);
    const departmentRecord = useMemo(
        () => (node?.dept ? (departments || []).find((d) => d.departmentName === node.dept.name) : null),
        [node, departments],
    );

    // Pull the backend's own department dashboard (efficiency / health) for the selected department
    useEffect(() => {
        const id = departmentRecord?.id;
        if (!id) return undefined;
        let cancelled = false;
        const t = setTimeout(() => {
            setDeptDash({ id, data: null, loading: true });
            dashboardService.getDepartmentDashboard(id)
                .then((data) => { if (!cancelled) setDeptDash({ id, data, loading: false }); })
                .catch(() => { if (!cancelled) setDeptDash({ id, data: null, loading: false }); });
        }, 0);
        return () => { cancelled = true; clearTimeout(t); };
    }, [departmentRecord?.id]);

    const dash = deptDash.id === departmentRecord?.id ? deptDash.data : null;
    const statusOf = (id) => nodes.find((n) => n.id === id)?.status || 'unknown';
    const labelOf = (id) => nodes.find((n) => n.id === id)?.label || id;

    return (
        <Box sx={{ width: '100%', pb: 4 }}>
            <PageHero
                eyebrow="Environmental"
                title="Plant Gas Flow"
                subtitle="How gases and materials move between departments — and how one department's emissions affect the next."
                icon={<MdHub />}
                actions={(
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={reload} disabled={loading} sx={{ minHeight: 44 }}>
                        Refresh
                    </Button>
                )}
            />

            {error && <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={reload}>Retry</Button>}>{error}</Alert>}

            <Card sx={{ p: { xs: 1.5, sm: 2.5 }, mb: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 1.5, mb: 2 }}>
                    <Typography variant="h3">Live department status</Typography>
                    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                        {['normal', 'warning', 'breach', 'maintenance'].map((s) => <StatusChip key={s} status={s} size="sm" label={STATUS_META[s].label} />)}
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 11.5, fontWeight: 700, color: '#0D9488' }}>
                            <Box component="span" sx={{ width: 18, borderTop: '2px dashed #0D9488' }} /> Gas
                        </Box>
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>
                            <Box component="span" sx={{ width: 18, borderTop: '2px dotted #64748B' }} /> Material
                        </Box>
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 11.5, fontWeight: 700, color: '#0891B2' }}>
                            <Box component="span" sx={{ width: 18, borderTop: '2px dashed #0891B2' }} /> Utility
                        </Box>
                    </Stack>
                </Stack>
                {loading && !analysis ? <Skeleton height={460} /> : (
                    <PlantFlowMap nodes={nodes} selectedId={activeId} highlightId={myNode} onSelect={setSelectedId} />
                )}
                <Typography variant="body2" sx={{ mt: 1.5 }}>
                    Select a department to see its units, emissions and the departments connected to it. Flows turn amber or red when the sending department is near or over its limits.
                </Typography>
            </Card>

            <AnimatePresence mode="wait">
                {node && (
                    <motion.div
                        key={node.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.28 }}
                    >
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 2.5 }}>
                            <Card sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                                    <Typography variant="h2">{node.label}</Typography>
                                    <StatusChip status={node.status} />
                                </Stack>
                                <Typography variant="body2" sx={{ mb: 2.5 }}>{node.role}</Typography>

                                {node.upstreamRisk.length > 0 && (
                                    <Alert severity="warning" sx={{ mb: 2.5 }}>
                                        {node.upstreamRisk.map((r) => `${labelOf(r.from)} is ${statusMeta(r.status).label.toLowerCase()}`).join('; ')} — the {node.upstreamRisk.map((r) => r.label).join(', ')} it supplies can raise emissions here. Coordinate with that department.
                                    </Alert>
                                )}

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.25, mb: 2.5 }}>
                                    <Stat label="Units" value={node.dept?.units.length ?? 0} />
                                    <Stat label="Avg health" value={fmt(dash?.averageHealthScore ?? node.dept?.healthScore)} tone={p.primary} />
                                    <Stat label="Avg efficiency" value={`${fmt(dash?.averageEfficiency ?? node.dept?.efficiency)}%`} tone={p.teal} />
                                    <Stat label="Limit breaches" value={node.dept?.breaches ?? 0} tone={(node.dept?.breaches ?? 0) > 0 ? p.error : p.success} />
                                </Box>

                                {!node.dept ? (
                                    <Alert severity="info">No units are linked to a department named “{node.label}” yet. Add units under Units to start tracking it.</Alert>
                                ) : (
                                    <Box sx={{ overflowX: 'auto', mx: { xs: -2, sm: 0 } }}>
                                        <Table size="small" sx={{ minWidth: 560 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Unit</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    {POLLUTANTS.map((pl) => <TableCell key={pl.key} align="right">{pl.label}</TableCell>)}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {node.dept.units.map((u) => (
                                                    <TableRow key={u.unit.id} hover>
                                                        <TableCell sx={{ fontWeight: 650 }}>{u.unit.unitName}</TableCell>
                                                        <TableCell><StatusChip status={u.status} size="sm" /></TableCell>
                                                        {POLLUTANTS.map((pl) => {
                                                            const v = u.latest?.[pl.key];
                                                            const s = classify(v, limits[pl.key]?.limit);
                                                            return (
                                                                <TableCell key={pl.key} align="right" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: s === 'unknown' ? p.textSecondary : statusMeta(s).color }}>
                                                                    {fmt(v)}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}
                            </Card>

                            <Stack sx={{ gap: 2.5 }}>
                                {[['Receives from', upstreamOf(node.id), 'from'], ['Sends to', downstreamOf(node.id), 'to']].map(([title, list, side]) => (
                                    <Card key={title} sx={{ p: { xs: 2, sm: 2.5 } }}>
                                        <Typography variant="h3" sx={{ mb: 1.5 }}>{title}</Typography>
                                        {list.length === 0 ? <Typography variant="body2">—</Typography> : (
                                            <Stack sx={{ gap: 1 }}>
                                                {list.map((f) => {
                                                    const other = f[side];
                                                    return (
                                                        <Box
                                                            key={`${f.from}-${f.to}`}
                                                            component="button"
                                                            type="button"
                                                            onClick={() => setSelectedId(other)}
                                                            sx={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: '100%',
                                                                p: 1.25, borderRadius: '12px', border: `1px solid ${p.border}`, bgcolor: '#fff', cursor: 'pointer', font: 'inherit', textAlign: 'left',
                                                                ...hoverLift,
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 700, fontSize: 14, color: p.text }}>{labelOf(other)}</Typography>
                                                                <Typography sx={{ fontSize: 12, color: p.textSecondary }}>{f.label}</Typography>
                                                            </Box>
                                                            <StatusChip status={statusOf(other)} size="sm" />
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        )}
                                    </Card>
                                ))}
                                {dash && (
                                    <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
                                        <Typography variant="h3" sx={{ mb: 1.5 }}>Unit status</Typography>
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                                            <Stat label="Operational" value={dash.operational ?? 0} tone={p.success} />
                                            <Stat label="Maintenance" value={dash.maintenance ?? 0} tone={p.cyan} />
                                            <Stat label="Warning" value={dash.warning ?? 0} tone={p.warning} />
                                        </Box>
                                    </Card>
                                )}
                            </Stack>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}
