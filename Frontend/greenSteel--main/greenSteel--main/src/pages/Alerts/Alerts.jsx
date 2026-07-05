import Sidebar from "../../components/Sidebar";
import { alerts } from "../../data/alertsData";

export default function Alerts() {

    return (

        <div className="dashboard">

            <Sidebar />

            <main className="main">

                {/* HEADER */}

                <div className="bf-header">

                    <div>

                        <h1>
                            Alert Management
                        </h1>

                        <p>
                            Real-time Environmental Alerts
                        </p>

                    </div>

                    <div className="last-update">

                        Active Alerts: 4

                    </div>

                </div>

                {/* SUMMARY */}

                <div className="bf-summary">

                    <div className="summary-box">
                        <h4>Critical</h4>
                        <h2>2</h2>
                    </div>

                    <div className="summary-box">
                        <h4>Warning</h4>
                        <h2>2</h2>
                    </div>

                    <div className="summary-box">
                        <h4>Resolved</h4>
                        <h2>12</h2>
                    </div>

                    <div className="summary-box">
                        <h4>Total Today</h4>
                        <h2>16</h2>
                    </div>

                </div>

                {/* ALERT TABLE */}

                <div className="panel">

                    <h3>
                        Active Alerts
                    </h3>

                    <table className="alert-table">

                        <thead>

                            <tr>

                                <th>
                                    Unit
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Value
                                </th>

                                <th>
                                    Severity
                                </th>

                                <th>
                                    Time
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                alerts.map(
                                    (
                                        alert,
                                        index
                                    ) => (

                                        <tr key={index}>

                                            <td>
                                                {alert.unit}
                                            </td>

                                            <td>
                                                {alert.category}
                                            </td>

                                            <td>
                                                {alert.value}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        alert.severity ===
                                                        "Critical"
                                                        ? "critical-badge"
                                                        : "warning-badge"
                                                    }
                                                >

                                                    {
                                                        alert.severity
                                                    }

                                                </span>

                                            </td>

                                            <td>
                                                {alert.time}
                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </main>

        </div>

    );

}