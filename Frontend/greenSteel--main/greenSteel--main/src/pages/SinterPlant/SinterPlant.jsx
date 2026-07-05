import { sinterPlants }
from "../../data/sinterPlantData";
import Sidebar from "../../components/Sidebar";
export default function SinterPlant() {

    return (
    <div className="dashboard">

        <Sidebar />

        <main className="main">

        <div className="bf-page">

            {/* HEADER */}

            <div className="bf-header">

                <div>

                    <h1>
                        Sinter Plant Monitoring
                    </h1>

                    <p>
                        RINL Sinter Production Units
                    </p>

                </div>

                <div className="last-update">
                    Last Updated: 12:15 PM
                </div>

            </div>

            {/* SUMMARY */}

            <div className="bf-summary">

                <div className="summary-box">
                    <h4>Operational</h4>
                    <h2>2</h2>
                </div>

                <div className="summary-box">
                    <h4>Maintenance</h4>
                    <h2>1</h2>
                </div>

                <div className="summary-box">
                    <h4>Production</h4>
                    <h2>16200</h2>
                </div>

                <div className="summary-box">
                    <h4>Efficiency</h4>
                    <h2>85%</h2>
                </div>

            </div>

            {/* ALERT */}

            <div className="alert-banner">

                SP3 particulate emissions
                exceeded permissible levels.

            </div>

            {/* SINTER CARDS */}

            <div className="bf-grid">

                {
                    sinterPlants.map(
                        plant => (

                            <div
                                key={plant.id}
                                className={`bf-card ${
                                    plant.status ===
                                    "Maintenance"
                                    ? "maintenance-card"
                                    : ""
                                }`}
                            >

                                <div className="bf-top">

                                    <h2>
                                        {plant.id}
                                    </h2>

                                    <span
                                        className={
                                            plant.status ===
                                            "Operational"
                                            ? "status-green"
                                            : "status-orange"
                                        }
                                    >
                                        ● {plant.status}
                                    </span>

                                </div>

                                {/* HEALTH */}

                                <div className="health">

                                    <span>
                                        Health Score
                                    </span>

                                    <b>
                                        {plant.health}%
                                    </b>

                                </div>

                                <div className="gauge">

                                    <div
                                        className="gauge-fill"
                                        style={{
                                            width:
                                            `${plant.health}%`
                                        }}
                                    />

                                </div>

                                {/* METRICS */}

                                <div className="metric">

                                    <span>
                                        SOx
                                    </span>

                                    <b>
                                        {plant.sox}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        NOx
                                    </span>

                                    <div>

                                        <b>
                                            {plant.nox}
                                        </b>

                                        <small>
                                            {plant.trend}
                                        </small>

                                    </div>

                                </div>

                                <div className="metric">

                                    <span>
                                        PM
                                    </span>

                                    <b>
                                        {plant.pm}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Dust
                                    </span>

                                    <b>
                                        {plant.dust}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Temperature
                                    </span>

                                    <b>
                                        {plant.temp}°C
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Production
                                    </span>

                                    <b>
                                        {plant.production}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Efficiency
                                    </span>

                                    <b>
                                        {plant.efficiency}%
                                    </b>

                                </div>

                            </div>

                        )
                    )
                }

            </div>

        </div>
        </main>
        </div>

    );

}