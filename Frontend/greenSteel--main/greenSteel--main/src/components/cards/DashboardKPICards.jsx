import {
    MdCo2,
    MdEco,
    MdWarningAmber,
    MdFactory,
} from "react-icons/md";

import DashboardKPICard from "./DashboardKPICard";

import "../../styles/DashboardKPICards.css";

const DashboardKPICards = ({ summary }) => {

    if (!summary) {

        return null;

    }

    return (

        <section className="dashboard-kpi-grid">

            <DashboardKPICard

                icon={<MdCo2 />}

                title="Average CO₂"

                value={summary.averageCOx.toFixed(1)}

                unit="ppm"

                trend="Live"

                trendType="positive"

            />

            <DashboardKPICard

                icon={<MdEco />}

                title="ESG Score"

                value={summary.esgScore.toFixed(1)}

                unit="%"

                trend="Excellent"

                trendType="positive"

            />

            <DashboardKPICard

                icon={<MdWarningAmber />}

                title="Warning Units"

                value={summary.warningUnits}

                unit=""

                trend={`${summary.maintenanceUnits} Maintenance`}

                trendType="negative"

            />

            <DashboardKPICard

                icon={<MdFactory />}

                title="Sustainability"

                value={summary.sustainabilityScore.toFixed(1)}

                unit="%"

                trend={`${summary.operationalUnits}/${summary.totalUnits} Operational`}

                trendType="positive"

            />

        </section>

    );

};

export default DashboardKPICards;