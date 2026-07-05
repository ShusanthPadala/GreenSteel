import { powerPlants } from "../../data/powerPlantData";
import Sidebar from "../../components/Sidebar";
export default function PowerPlant() {

    return (
    <div className="dashboard">

        <Sidebar />

        <main className="main">

        <div className="bf-page">

            {/* HEADER */}

            <div className="bf-header">

                <div>

                    <h1>
                        Power Plant Monitoring
                    </h1>

                    <p>
                        RINL Captive Thermal Power Plant
                    </p>

                </div>

                <div className="last-update">
                    Last Updated: 12:45 PM
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
                    <h4>Generation</h4>
                    <h2>580 MW</h2>
                </div>

                <div className="summary-box">
                    <h4>Efficiency</h4>
                    <h2>86%</h2>
                </div>

            </div>

            {/* ALERT */}

            <div className="alert-banner">

                Boiler 3 under maintenance.
                Increased SOx levels detected.

            </div>

            {/* BOILERS */}

            <div className="bf-grid">

                {
                    powerPlants.map(
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
                                        CO₂
                                    </span>

                                    <b>
                                        {plant.co2}
                                    </b>

                                </div>

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
                                        Temperature
                                    </span>

                                    <b>
                                        {plant.temperature}°C
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Generation
                                    </span>

                                    <b>
                                        {plant.generation} MW
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