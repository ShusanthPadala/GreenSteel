import { esgData } from "../../data/esgData";
import Sidebar from "../../components/Sidebar";
export default function ESG() {

    return (
    <div className="dashboard">

        <Sidebar />

        <main className="main">

        <div className="bf-page">

            {/* HEADER */}

            <div className="bf-header">

                <div>

                    <h1>
                        ESG Dashboard
                    </h1>

                    <p>
                        Environmental, Social &
                        Governance Performance
                    </p>

                </div>

                <div className="last-update">

                    Last Updated: Today

                </div>

            </div>

            {/* ESG SCORE CARDS */}

            <div className="bf-summary">

                <div className="summary-box">

                    <h4>
                        Environmental
                    </h4>

                    <h2 className="esg-score">
                        {esgData.environmental}
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        Social
                    </h4>

                    <h2 className="esg-score">
                        {esgData.social}
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        Governance
                    </h4>

                    <h2 className="esg-score">
                        {esgData.governance}
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        ESG Score
                    </h4>

                    <h2 className="esg-score">
                        {esgData.sustainabilityIndex}
                    </h2>

                </div>

            </div>

            {/* ALERT */}

            <div className="alert-banner">

                Sustainability targets achieved
                for Q2 2026. Renewable energy
                utilization increased by 8%.

            </div>

            {/* ENVIRONMENTAL */}

            <div className="panel">

                <h3>
                    Environmental Performance
                </h3>

                <div className="health">

                    <span>
                        ESG Health Score
                    </span>

                    <b>
                        {esgData.environmental}%
                    </b>

                </div>

                <div className="gauge">

                    <div
                        className="gauge-fill"
                        style={{
                            width:
                            `${esgData.environmental}%`
                        }}
                    />

                </div>

                <div className="metric">

                    <span>
                        Carbon Footprint
                    </span>

                    <b>
                        {esgData.carbonFootprint}
                        tons
                    </b>

                </div>

                <div className="metric">

                    <span>
                        Water Efficiency
                    </span>

                    <b>
                        {esgData.waterEfficiency}%
                    </b>

                </div>

                <div className="metric">

                    <span>
                        Waste Recycling
                    </span>

                    <b>
                        {esgData.wasteRecycling}%
                    </b>

                </div>

                <div className="metric">

                    <span>
                        Renewable Energy
                    </span>

                    <b>
                        {esgData.renewableEnergy}%
                    </b>

                </div>

            </div>

            {/* SOCIAL */}

            <div className="panel">

                <h3>
                    Social Performance
                </h3>

                <div className="health">

                    <span>
                        ESG Health Score
                    </span>

                    <b>
                        {esgData.social}%
                    </b>

                </div>

                <div className="gauge">

                    <div
                        className="gauge-fill"
                        style={{
                            width:
                            `${esgData.social}%`
                        }}
                    />

                </div>

                <div className="metric">

                    <span>
                        Employee Safety
                    </span>

                    <b>
                        {esgData.employeeSafety}%
                    </b>

                </div>

                <div className="metric">

                    <span>
                        Training Hours
                    </span>

                    <b>
                        {esgData.trainingHours}
                    </b>

                </div>

            </div>

            {/* GOVERNANCE */}

            <div className="panel">

                <h3>
                    Governance Performance
                </h3>

                <div className="health">

                    <span>
                        ESG Health Score
                    </span>

                    <b>
                        {esgData.governance}%
                    </b>

                </div>

                <div className="gauge">

                    <div
                        className="gauge-fill"
                        style={{
                            width:
                            `${esgData.governance}%`
                        }}
                    />

                </div>

                <div className="metric">

                    <span>
                        Board Compliance
                    </span>

                    <b>
                        {esgData.boardCompliance}%
                    </b>

                </div>

                <div className="metric">

                    <span>
                        Sustainability Index
                    </span>

                    <b>
                        {esgData.sustainabilityIndex}
                    </b>

                </div>

            </div>

        </div>
        </main>
        </div>

    );

}