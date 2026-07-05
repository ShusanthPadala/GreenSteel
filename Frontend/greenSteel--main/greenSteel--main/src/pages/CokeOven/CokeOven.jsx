import { cokeOvens }
from "../../data/cokeOvenData";
import Sidebar from "../../components/Sidebar";
export default function CokeOven() {

    return (
    <div className="dashboard">

        <Sidebar />

        <main className="main">

        <div className="bf-page">

            {/* HEADER */}

            <div className="bf-header">

                <div>

                    <h1>
                        Coke Oven Monitoring
                    </h1>

                    <p>
                        RINL Coke Oven Batteries
                    </p>

                </div>

                <div className="last-update">
                    Last Updated: 11:45 AM
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
                        12600
                    </h2>

                </div>

                <div className="summary-box">

                    <h4>
                        Avg Efficiency
                    </h4>

                    <h2>
                        86%
                    </h2>

                </div>

            </div>

            {/* ALERT */}

            <div className="alert-banner">

                Battery 3 NOx emissions
                exceeded threshold.

            </div>

            {/* BATTERIES */}

            <div className="bf-grid">

                {
                    cokeOvens.map(
                        oven => (

                            <div
                                key={oven.id}
                                className={`bf-card ${
                                    oven.status ===
                                    "Maintenance"
                                    ? "maintenance-card"
                                    : ""
                                }`}
                            >

                                <div className="bf-top">

                                    <h2>
                                        {oven.id}
                                    </h2>

                                    <span
                                        className={
                                            oven.status ===
                                            "Operational"
                                            ? "status-green"
                                            : "status-orange"
                                        }
                                    >
                                        ● {oven.status}
                                    </span>

                                </div>

                                {/* HEALTH */}

                                <div className="health">

                                    <span>
                                        Health Score
                                    </span>

                                    <b>
                                        {oven.health}%
                                    </b>

                                </div>

                                <div className="gauge">

                                    <div
                                        className="gauge-fill"
                                        style={{
                                            width:
                                            `${oven.health}%`
                                        }}
                                    />

                                </div>

                                {/* METRICS */}

                                <div className="metric">

                                    <span>
                                        SOx
                                    </span>

                                    <b>
                                        {oven.sox}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        NOx
                                    </span>

                                    <div>

                                        <b>
                                            {oven.nox}
                                        </b>

                                        <small>
                                            {oven.trend}
                                        </small>

                                    </div>

                                </div>

                                <div className="metric">

                                    <span>
                                        PM
                                    </span>

                                    <b>
                                        {oven.pm}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Temperature
                                    </span>

                                    <b>
                                        {oven.temp}°C
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Production
                                    </span>

                                    <b>
                                        {oven.production}
                                    </b>

                                </div>

                                <div className="metric">

                                    <span>
                                        Efficiency
                                    </span>

                                    <b>
                                        {oven.efficiency}%
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