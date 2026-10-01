import { Box, Card, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useReducedMotion } from "framer-motion";
import { ShowChartRounded } from "@mui/icons-material";
import IconOrb from "../ui/IconOrb";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const ChartHeader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
        <Box sx={{ perspective: 400 }}>
            <IconOrb size={42}><ShowChartRounded /></IconOrb>
        </Box>
        <Box>
            <Typography variant="h3" sx={{ mb: 0.25 }}>Emission trend analysis</Typography>
            <Typography variant="body2" color="text.secondary">Monthly average pollutant levels over time.</Typography>
        </Box>
    </Box>
);

const DashboardEmissionTrendChart = ({ trends = [] }) => {
    const reduceMotion = useReducedMotion();

    if (!trends || trends.length === 0) {
        return (
            <Card sx={{ p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column' }}>
                <ChartHeader />
                <Box sx={{ mt: 2, py: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(180deg, rgba(236,253,245,0.5), rgba(246,248,250,0.3))', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                    <Box sx={{ perspective: 400, mb: 2 }}><IconOrb size={52} tone="#6EE7B7"><ShowChartRounded /></IconOrb></Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>No emission trend data available</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Trend data will appear here when historical readings are collected.</Typography>
                </Box>
            </Card>
        );
    }

    const chartData = {
        labels: trends.map(trend => `${trend.month} ${trend.year}`),
        datasets: [
            {
                label: "COx",
                data: trends.map(t => t.cox),
                borderColor: "#334155",
                backgroundColor: "rgba(15, 23, 42, 0.1)",
                fill: false,
                borderDash: [],
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 7,
                pointBackgroundColor: "#FFFFFF",
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3,
                borderWidth: 2.5
            },
            {
                label: "NOx",
                data: trends.map(t => t.nox),
                borderColor: "#047857",
                backgroundColor: "#047857",
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 7,
                pointBackgroundColor: "#FFFFFF",
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3,
                borderWidth: 2.5
            },
            {
                label: "SOx",
                data: trends.map(t => t.sox),
                borderColor: "#D97706",
                backgroundColor: "#D97706",
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 7,
                pointBackgroundColor: "#FFFFFF",
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3,
                borderWidth: 2.5
            },
            {
                label: "PM",
                data: trends.map(t => t.pm),
                borderColor: "#DC2626",
                backgroundColor: "#DC2626",
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 7,
                pointBackgroundColor: "#FFFFFF",
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3,
                borderWidth: 2.5
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { size: 12, family: "'Inter', sans-serif", weight: 600 },
                    color: '#475569',
                    padding: 18,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                titleFont: { size: 13, family: "'Manrope', 'Inter', sans-serif", weight: 700 },
                bodyFont: { size: 13, family: "'Inter', sans-serif" },
                padding: 14,
                cornerRadius: 12,
                boxPadding: 6,
                usePointStyle: true,
                borderColor: 'rgba(52, 211, 153, 0.35)',
                borderWidth: 1
            }
        },
        animation: reduceMotion ? false : { duration: 400 },
        layout: { padding: { top: 10, bottom: 10 } },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: "'Inter', sans-serif", size: 12 }, color: '#475569' }
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(226, 232, 240, 0.7)" },
                border: { display: false },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 12 },
                    color: '#475569',
                    padding: 12
                }
            }
        }
    };

    return (
        <Card sx={{ p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 }}>
            <ChartHeader />
            <Box sx={{ position: 'relative', flexGrow: 1, height: 300, width: '100%', mt: 1 }}>
                <Line data={chartData} options={chartOptions} />
            </Box>
        </Card>
    );
};

export default DashboardEmissionTrendChart;
