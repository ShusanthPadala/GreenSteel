import { Box, Card, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useReducedMotion } from "framer-motion";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const DashboardEmissionTrendChart = ({ trends = [] }) => {
    const reduceMotion = useReducedMotion();

    if (!trends || trends.length === 0) {
        return (
            <Card sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', boxShadow: 'none' }}>
                <Box mb={2}>
                    <Typography variant="h3" sx={{ mb: 0.5 }}>Emission trend analysis</Typography>
                    <Typography variant="body2" color="text.secondary">Monthly average pollutant levels over time.</Typography>
                </Box>
                <Box sx={{ mt: 2, py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--color-background)', borderRadius: 2, border: '1px dashed var(--color-border)' }}>
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
                borderColor: "#17201B",
                backgroundColor: "rgba(23, 32, 27, 0.1)",
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 2
            },
            {
                label: "NOx",
                data: trends.map(t => t.nox),
                borderColor: "#355E45",
                backgroundColor: "#355E45",
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 2
            },
            {
                label: "SOx",
                data: trends.map(t => t.sox),
                borderColor: "#B9822B",
                backgroundColor: "#B9822B",
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 2
            },
            {
                label: "PM",
                data: trends.map(t => t.pm),
                borderColor: "#C65353",
                backgroundColor: "#C65353",
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 2
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
                    color: '#66716A',
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(23, 32, 27, 0.9)',
                titleFont: { size: 13, family: "'Inter', sans-serif" },
                bodyFont: { size: 13, family: "'Inter', sans-serif" },
                padding: 12,
                cornerRadius: 8
            }
        },
        animation: reduceMotion ? false : { duration: 400 },
        layout: { padding: { top: 10, bottom: 10 } },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: "'Inter', sans-serif", size: 12 }, color: '#66716A' }
            },
            y: {
                beginAtZero: true,
                grid: { color: "#DDE2DD" },
                border: { display: false },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 12 },
                    color: '#66716A',
                    padding: 12
                }
            }
        }
    };

    return (
        <Card sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 380, boxShadow: 'none' }}>
            <Box mb={4}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>Emission trend analysis</Typography>
                <Typography variant="body2" color="text.secondary">Monthly average pollutant levels over time.</Typography>
            </Box>
            <Box sx={{ position: 'relative', flexGrow: 1, height: 280, width: '100%' }}>
                <Line data={chartData} options={chartOptions} />
            </Box>
        </Card>
    );
};

export default DashboardEmissionTrendChart;
