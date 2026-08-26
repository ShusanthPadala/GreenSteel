import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Stack, Button, CircularProgress, Alert, Card, CardContent, Divider } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import dashboardService from "../../services/dashboardService";
import DashboardKPICards from "../../components/cards/DashboardKPICards";
import DashboardEmissionTrendChart from "../../components/charts/DashboardEmissionTrendChart";
import { useAuth } from "../../contexts/AuthContext";
import { getErrorMessage } from "../../services/api";

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
                 <CircularProgress size={40} sx={{ mb: 2, color: 'primary.main' }} />
                 <Typography variant="body2" sx={{ fontWeight: 600 }}>Loading dashboard analytics...</Typography>
            </Box>
        );
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

    return (
        <Box sx={{ pb: 4, width: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Area */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={2} sx={{ mb: 3.5, width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #DDE4DE', pb: 2.25 }}>
                <Box>
                    <Typography variant="h1" sx={{ mb: 0.5 }}>
                        {greeting()}, {user?.firstName?.split(' ')[0] || 'User'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here is today's overview of your plant's operations.
                    </Typography>
                </Box>
                <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />} 
                    onClick={loadDashboard}
                    sx={{ 
                        minHeight: 44, 
                        minWidth: { xs: '100%', sm: 'auto' }, 
                        alignSelf: { xs: 'flex-start', sm: 'center' },
                        bgcolor: '#FFFFFF',
                        borderColor: '#C9D8CC',
                        color: '#3F654B'
                    }}
                >
                    Refresh Data
                </Button>
            </Stack>

            <Box sx={{ mb: 4 }}>
                <DashboardKPICards summary={summary} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <DashboardEmissionTrendChart trends={trends} />
            </Box>

            {summary && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h2" sx={{ mb: 0.5 }}>Operational overview</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
                        Current unit status across the plant.
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                        {[
                            ['Operational', summary.operationalUnits, '#3F7A52'],
                            ['Maintenance', summary.maintenanceUnits, '#B9822B'],
                            ['Warnings', summary.warningUnits, '#C65353'],
                            ['Total units', summary.totalUnits, '#355E45'],
                        ].map(([label, value, color]) => (
                            <Card key={label} sx={{ boxShadow: 'none' }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
                                    <Typography sx={{ mt: 1, fontSize: '1.75rem', lineHeight: 1, fontWeight: 700, color }}>{value ?? 'N/A'}</Typography>
                                    <Divider sx={{ mt: 2 }} />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
