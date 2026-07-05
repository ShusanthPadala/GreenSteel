import Sidebar from "../../components/Sidebar";
import { reports } from "../../data/reportData";

export default function Reports() {

    return (

        <div className="dashboard">

            <Sidebar />

            <main className="main">

                {/* HEADER */}

                <div className="bf-header">

                    <div>

                        <h1>
                            Environmental Reports
                        </h1>

                        <p>
                            Compliance & Sustainability Reports
                        </p>

                    </div>

                    <div className="last-update">

                        Total Reports: 4

                    </div>

                </div>

                {/* SUMMARY */}

                <div className="bf-summary">

                    <div className="summary-box">
                        <h4>Generated</h4>
                        <h2>3</h2>
                    </div>

                    <div className="summary-box">
                        <h4>Pending</h4>
                        <h2>1</h2>
                    </div>

                    <div className="summary-box">
                        <h4>PDF</h4>
                        <h2>3</h2>
                    </div>

                    <div className="summary-box">
                        <h4>Excel</h4>
                        <h2>1</h2>
                    </div>

                </div>

                {/* REPORTS */}

                <div className="panel">

                    <h3>
                        Available Reports
                    </h3>

                    <table className="alert-table">

                        <thead>

                            <tr>

                                <th>
                                    Report
                                </th>

                                <th>
                                    Format
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                reports.map(
                                    (
                                        report,
                                        index
                                    ) => (

                                        <tr key={index}>

                                            <td>
                                                {report.name}
                                            </td>

                                            <td>
                                                {report.type}
                                            </td>

                                            <td>
                                                {report.date}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        report.status ===
                                                        "Generated"
                                                        ? "generated-badge"
                                                        : "warning-badge"
                                                    }
                                                >

                                                    {report.status}

                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="download-btn"
                                                >
                                                    Download
                                                </button>

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