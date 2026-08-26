import { Box, Typography } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

const DashboardKPICard = ({ icon, title, value, unit, trend, trendType }) => {
    
    // Determine status colors based on trendType (positive/negative/neutral)
    let statusColor = "#64706A";
    let iconColor = "#17211D";
    let iconBg = "rgba(23, 33, 29, 0.05)";
    
    if (trendType === "positive") {
        statusColor = "#2F7D4A";
        iconColor = "#2F6B45";
        iconBg = "rgba(47, 107, 69, 0.08)";
    }
    else if (trendType === "negative") {
        statusColor = "#C94A4A";
        iconColor = "#C94A4A";
        iconBg = "rgba(201, 74, 74, 0.08)";
    }
    else if (trendType === "warning") {
        statusColor = "#B7791F";
        iconColor = "#B7791F";
        iconBg = "rgba(183, 121, 31, 0.08)";
    }

    return (
        <Box sx={{ 
            bgcolor: "#FFFFFF", 
            p: 3, 
            borderRadius: 3, 
            border: "1px solid #DCE2DD",
            display: "flex", 
            flexDirection: "column",
            boxShadow: "0 2px 10px rgba(23, 33, 29, 0.02)",
            minHeight: 140,
            transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
            '&:hover': {
                transform: 'translateY(-3px)',
                borderColor: '#C8D7CC',
                boxShadow: '0 10px 24px rgba(23, 33, 29, 0.08)',
            }
        }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.75rem' }}>
                    {title}
                </Typography>
                <Box sx={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 1.5,
                    bgcolor: iconBg, color: iconColor,
                    '& > svg': { fontSize: 18 }
                }}>
                    {icon}
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 2, flexGrow: 1 }}>
                <Typography sx={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.1, color: "#17211D", letterSpacing: "-0.03em" }}>
                    {value}
                </Typography>
                {unit && (
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        {unit}
                    </Typography>
                )}
            </Box>

            {trend && (
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 0.5, 
                    color: statusColor,
                    mt: "auto",
                    bgcolor: 'var(--color-background)',
                    alignSelf: 'flex-start',
                    px: 1, py: 0.5,
                    borderRadius: 1.5
                }}>
                    {trendType === 'positive' && <TrendingDown fontSize="small" sx={{ fontSize: 14 }} />}
                    {trendType === 'negative' && <TrendingUp fontSize="small" sx={{ fontSize: 14 }}  />}
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {trend}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default DashboardKPICard;
