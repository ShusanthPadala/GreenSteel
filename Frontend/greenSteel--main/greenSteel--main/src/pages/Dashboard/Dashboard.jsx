import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Stack, Button, Alert, Card } from "@mui/material";
import { Refresh as RefreshIcon, CheckCircleOutlined, BuildOutlined, ReportProblemOutlined, FactoryOutlined } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import dashboardService from "../../services/dashboardService";
import DashboardKPICards from "../../components/cards/DashboardKPICards";
import DashboardEmissionTrendChart from "../../components/charts/DashboardEmissionTrendChart";
import { useAuth } from "../../contexts/AuthContext";
import { getErrorMessage } from "../../services/api";
import LazySteelScene from "../../components/three/LazySteelScene";
import TiltCard from "../../components/ui/TiltCard";
import IconOrb from "../../components/ui/IconOrb";
import Loader3D from "../../components/ui/Loader3D";
import RoleInsights from "../../components/dashboard/RoleInsights";
import usePlantData from "../../hooks/usePlantData";
import { classify } from "../../utils/emissionAnalytics";
import { statusMeta } from "../../constants/statusMeta";
import { palette as p, hero, headingFont, hoverLift } from "../../styles/tokens";

const Dashboard = () => {
    const { user } = useAuth();
    const reduceMotion = useReducedMotion();
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const plant = usePlantData();

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const summaryData = await dashboardService.getSummary();
            const trendData = await dashboardService.getTrends();
            setSummary(summaryData);
            setTrends(trendData);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load dashboard data."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => { loadDashboard(); }, 0);
        return () => clearTimeout(timer);
    }, [loadDashboard]);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    if (loading) {
        return <Loader3D label="Loading dashboard analytics..." sublabel="Gathering the latest plant readings" />;
    }

    if (error) {
        return (
            <Box sx={{ mt: 2 }}>
                <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadDashboard}>Retry</Button>}>
                    {error}
                </Alert>
            </Box>
        );
    }

    const total = Number(summary?.totalUnits) || 0;
    const overview = summary ? [
        { label: 'Operational', value: summary.operationalUnits, tone: p.success, icon: <CheckCircleOutlined /> },
        { label: 'Maintenance', value: summary.maintenanceUnits, tone: p.warning, icon: <BuildOutlined /> },
        { label: 'Warnings', value: summary.warningUnits, tone: p.error, icon: <ReportProblemOutlined /> },
        { label: 'Total units', value: summary.totalUnits, tone: p.primary, icon: <FactoryOutlined /> },
    ] : [];

    return (
        <Box sx={{ pb: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 3.5 } }}>
            {/* 3D Hero banner */}
            <Box
                component={motion.div}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                sx={{
                    position: 'relative', overflow: 'hidden', borderRadius: '28px', color: '#FFFFFF',
                    minHeight: { xs: 260, md: 240 },
                    background: `${hero.glow}, ${hero.gradient(135)}`,
                    boxShadow: hero.shadow,
                    display: 'flex', alignItems: 'center',
                }}
            >
                <Box sx={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: { xs: '100%', md: '55%' }, opacity: { xs: 0.45, md: 1 } }}>
                    <LazySteelScene variant="compact" scale={1} offsetY={0.1} />
                </Box>
                <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,78,59,0.35) 0%, rgba(6,78,59,0.1) 45%, rgba(6,78,59,0) 70%)', pointerEvents: 'none' }} />

                <Box sx={{ position: 'relative', p: { xs: 3, sm: 4, md: 5 }, maxWidth: 620 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.5, mb: 2, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)' }}>
                        <span className="gs-live-dot" />
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ECFDF5' }}>Plant overview</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: headingFont, fontSize: { xs: '2.2rem', md: '3rem' }, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, mb: 1, color: '#FFFFFF', textShadow: '0 4px 24px rgba(0,0,0,0.25)' }}>
                        {greeting()}, {user?.firstName?.split(' ')[0] || 'User'}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.92)', fontSize: '1rem', mb: 3 }}>
                        Here is today's overview of your plant's operations.
                    </Typography>
                    <Button
                        startIcon={<RefreshIcon />}
                        onClick={() => { loadDashboard(); plant.reload(); }}
                        sx={{
                            minHeight: 44, px: 2.25, borderRadius: '12px', color: p.night, fontWeight: 700,
                            background: 'linear-gradient(180deg, #FFFFFF, #E2E8F0)',
                            boxShadow: '0 2px 0 rgba(0,0,0,0.15), 0 10px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 #fff',
                            '&:hover': { background: '#FFFFFF', transform: 'translateY(-2px)', boxShadow: '0 4px 0 rgba(0,0,0,0.15), 0 16px 30px -10px rgba(0,0,0,0.55)' },
                            '& .MuiSvgIcon-root': { transition: 'transform 400ms ease' },
                            '&:hover .MuiSvgIcon-root': { transform: 'rotate(180deg)' },
                        }}
                    >
                        Refresh Data
                    </Button>
                </Box>
            </Box>

            <DashboardKPICards summary={summary} />

            {/* Average level of every tracked pollutant (from /dashboard/summary) */}
            {summary && (
                <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>Average pollutant levels</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                        {[
                            ['COx', summary.averageCOx, '#334155'],
                            ['NOx', summary.averageNOx, p.primary],
                            ['SOx', summary.averageSOx, p.warning],
                            ['PM', summary.averagePM, p.error],
                        ].map(([label, value, tone]) => (
                            <Box key={label} sx={{ p: 2, borderRadius: '14px', border: `1px solid ${p.border}`, bgcolor: '#FFFFFF', position: 'relative', overflow: 'hidden', ...hoverLift }}>
                                <Box aria-hidden sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: tone }} />
                                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.75 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tone }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
                                </Stack>
                                <Typography sx={{ fontFamily: headingFont, fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: (() => { const k = label.toLowerCase(); const st = classify(value, plant.limits[k]?.limit); return st === 'unknown' ? p.text : statusMeta(st).color; })() }}>
                                    {typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : 'N/A'}
                                </Typography>
                                <Typography sx={{ mt: 0.75, fontSize: 11.5, color: p.textSecondary, fontWeight: 600 }}>
                                    limit {plant.limits[label.toLowerCase()]?.limit} {plant.limits[label.toLowerCase()]?.unit}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Card>
            )}

            {/* Role-specific view: your department & its gas links, or the whole plant */}
            <RoleInsights user={user} plant={plant} />

            <Box sx={{ flexGrow: 1 }}>
                <DashboardEmissionTrendChart trends={trends} />
            </Box>

            {summary && (
                <Box>
                    <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", mb: 2.5 }}>
                        <Box>
                            <Typography variant="h2" sx={{ mb: 0.5 }}>Operational overview</Typography>
                            <Typography variant="body1" color="text.secondary">
                                Current unit status across the plant.
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 2.5 } }}>
                        {overview.map(({ label, value, tone, icon }, idx) => {
                            const share = total > 0 && typeof value === 'number' ? Math.min(100, (value / total) * 100) : 0;
                            return (
                                <motion.div
                                    key={label}
                                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                                >
                                    <TiltCard intensity={7}>
                                        <Card sx={{ p: { xs: 2, sm: 2.5 }, height: '100%', overflow: 'visible', transformStyle: 'preserve-3d' }}>
                                            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 650 }}>{label}</Typography>
                                                <IconOrb tone={tone} size={36}>{icon}</IconOrb>
                                            </Stack>
                                            <Typography sx={{ fontFamily: headingFont, fontSize: { xs: '1.75rem', sm: '2.1rem' }, lineHeight: 1, fontWeight: 800, color: tone, letterSpacing: '-0.03em', transform: 'translateZ(18px)' }}>
                                                {value ?? 'N/A'}
                                            </Typography>
                                            <Box sx={{ mt: 2.25, height: 6, borderRadius: 999, bgcolor: 'rgba(15,23,42,0.06)', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.08)' }}>
                                                <Box
                                                    component={motion.div}
                                                    initial={reduceMotion ? false : { width: 0 }}
                                                    animate={{ width: `${label === 'Total units' ? (total > 0 ? 100 : 0) : share}%` }}
                                                    transition={{ duration: 1, delay: 0.3 + idx * 0.08, ease: 'easeOut' }}
                                                    sx={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${tone}AA, ${tone})`, boxShadow: `0 0 10px ${tone}66` }}
                                                />
                                            </Box>
                                        </Card>
                                    </TiltCard>
                                </motion.div>
                            );
                        })}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
