import { blastFurnaces } from "../../data/blastFurnaceData";
import Sidebar from "../../components/Sidebar";
export default function BlastFurnace() {

    return (
    <div className="dashboard">

        <Sidebar />

        <main className="main">

        <div className="bf-page">

            {/* HEADER */}

            <div className="bf-header">

                <div>
                    <h1>
                        Blast Furnace Monitoring
                    </h1>

                    <p>
                        RINL Environmental System
                    </p>
                </div>

                <div className="last-update">
                    Last Updated: 10:42 AM
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
                    <h4>Total CO₂</h4>
                    <h2>4400</h2>
                </div>

                <div className="summary-box">
                    <h4>Avg Efficiency</h4>
                    <h2>85%</h2>
                </div>

            </div>

            {/* ALERT */}

            <div className="alert-banner">

                BF3 scheduled maintenance •
                Estimated downtime: 18 hours

            </div>

            {/* BF CARDS */}

            <div className="bf-grid">

                {
                    blastFurnaces.map(
                        furnace => (

                            <div
                                key={furnace.id}
                                className={`bf-card ${
                                    furnace.status ===
                                    "Maintenance"
                                    ? "maintenance-card"
                                    : ""
                                }`}
                            >

                                <div className="bf-top">

                                    <h2>
                                        {furnace.id}
                                    </h2>

                                    <span
                                        className={
                                            furnace.status ===
                                            "Operational"
                                            ? "status-green"
                                            : "status-orange"
                                        }
                                    >
                                        ● {furnace.status}
                                    </span>

                                </div>

                                {/* HEALTH */}

                                <div className="health">

                                    <span>
                                        Health Score
                                    </span>

                                    <b>
                                        {furnace.health}%
                                    </b>

                                </div>

                                <div className="gauge">

                                    <div
                                        className="gauge-fill"
                                        style={{
                                            width:
                                            `${furnace.health}%`
                                        }}
                                    />

                                </div>

                                {/* METRICS */}

                                <div className="metric">

                                    <span>CO₂</span>

                                    <b>
                                        {furnace.co2}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>SOx</span>

                                    <div>

                                        <b>
                                            {furnace.sox}
                                        </b>

                                        <small>
                                            {furnace.trend}
                                        </small>

                                    </div>

                                </div>

                                <div className="metric">

                                    <span>NOx</span>

                                    <b>
                                        {furnace.nox}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>PM</span>

                                    <b>
                                        {furnace.pm}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>Temp</span>

                                    <b>
                                        {furnace.temp}°C
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>Efficiency</span>

                                    <b>
                                        {furnace.efficiency}%
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