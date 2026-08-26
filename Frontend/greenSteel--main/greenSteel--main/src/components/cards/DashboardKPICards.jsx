import { Box } from "@mui/material";
import { MdCo2, MdEco, MdWarningAmber, MdFactory } from "react-icons/md";
import DashboardKPICard from "./DashboardKPICard";

const DashboardKPICards = ({ summary }) => {
    if (!summary) return null;

    const formatMetric = (value) =>
        typeof value === "number" && Number.isFinite(value)
            ? value.toFixed(1)
            : "N/A";
            
    const formatCount = (value) =>
        typeof value === "number" && Number.isFinite(value)
            ? value
            : "0";

    return (
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, 
            gap: 3 
        }}>
            <DashboardKPICard
                icon={<MdCo2 />}
                title="Average COx"
                value={formatMetric(summary.averageCOx)}
                unit="ppm"
                trend="Current Average"
                trendType="neutral"
                index={0}
            />
            <DashboardKPICard
                icon={<MdEco />}
                title="ESG Score"
                value={formatMetric(summary.esgScore)}
                unit="/ 100"
                trend="Current Rating"
                trendType="positive"
                index={1}
            />
            <DashboardKPICard
                icon={<MdWarningAmber />}
                title="Warning Units"
                value={formatCount(summary.warningUnits)}
                unit=""
                trend={`${formatCount(summary.maintenanceUnits)} in Maintenance`}
                trendType={summary.warningUnits > 0 ? "negative" : "positive"}
                index={2}
            />
            <DashboardKPICard
                icon={<MdFactory />}
                title="Sustainability"
                value={formatMetric(summary.sustainabilityScore)}
                unit="%"
                trend={`${formatCount(summary.operationalUnits)}/${formatCount(summary.totalUnits)} Operational`}
                trendType="positive"
                index={3}
            />
        </Box>
    );
};

export default DashboardKPICards;
