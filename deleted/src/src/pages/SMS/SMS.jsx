import { smsUnits } from "../../data/smsData";
import Sidebar from "../../components/Sidebar";
export default function SMS() {

    return (
    <div className="dashboard">

        <Sidebar />

        <main className="main">

        <div className="bf-page">

            {/* HEADER */}

            <div className="bf-header">

                <div>

                    <h1>
                        Steel Melting Shop
                    </h1>

                    <p>
                        RINL SMS Operations
                    </p>

                </div>

                <div className="last-update">

                    Last Updated: 1:30 PM

                </div>

            </div>

            {/* SUMMARY */}

            <div className="bf-summary">

                <div className="summary-box">

                    <h4>
                        Operational
                    </h4>

                    <h2>
                        2
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        Maintenance
                    </h4>

                    <h2>
                        1
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        Production
                    </h4>

                    <h2>
                        13500
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        Efficiency
                    </h4>

                    <h2>
                        85%
                    </h2>

                </div>

            </div>

            {/* ALERT */}

            <div className="alert-banner">

                SMS-3 undergoing scheduled
                maintenance. Production
                capacity reduced by 15%.

            </div>

            {/* SMS CARDS */}

            <div className="bf-grid">

                {
                    smsUnits.map(
                        unit => (

                            <div
                                key={unit.id}
                                className={`bf-card ${
                                    unit.status ===
                                    "Maintenance"
                                    ? "maintenance-card"
                                    : ""
                                }`}
                            >

                                <div className="bf-top">

                                    <h2>
                                        {unit.id}
                                    </h2>

                                    <span
                                        className={
                                            unit.status ===
                                            "Operational"
                                            ? "status-green"
                                            : "status-orange"
                                        }
                                    >
                                        ● {unit.status}
                                    </span>

                                </div>

                                {/* HEALTH */}

                                <div className="health">

                                    <span>
                                        Health Score
                                    </span>

                                    <b>
                                        {unit.health}%
                                    </b>

                                </div>

                                <div className="gauge">

                                    <div
                                        className="gauge-fill"
                                        style={{
                                            width:
                                            `${unit.health}%`
                                        }}
                                    />

                                </div>

                                {/* METRICS */}

                                <div className="metric">

                                    <span>
                                        CO₂
                                    </span>

                                    <b>
                                        {unit.co2}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Temperature
                                    </span>

                                    <b>
                                        {unit.temperature}°C
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Production
                                    </span>

                                    <b>
                                        {unit.production}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Energy
                                    </span>

                                    <b>
                                        {unit.energy}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Oxygen Usage
                                    </span>

                                    <b>
                                        {unit.oxygen}%
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Efficiency
                                    </span>

                                    <div>

                                        <b>
                                            {unit.efficiency}%
                                        </b>

                                        <small>
                                            {unit.trend}
                                        </small>

                                    </div>

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