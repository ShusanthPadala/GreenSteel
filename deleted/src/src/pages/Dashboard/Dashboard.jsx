
import { kpiData } from "../../data/kpiData";
import { alerts } from "../../data/alertsData";
import { esgData } from "../../data/esgData";
import { activityData } from "../../data/activityData";
import { plantData } from "../../data/plantData";
import EmissionChart from "../../components/charts/EmissionChart";
import Sidebar from "../../components/Sidebar";
export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar/>
      <main className="main">
    

        {/* NAVBAR */}

        <header className="navbar">

          <h2>
            RINL Environmental Monitoring System
          </h2>

          <div className="status">
            Operational
          </div>

        </header>

        {/* KPI CARDS */}

        <section className="cards">

          <div className="card">
            <h4>CO₂ Emission</h4>
            <h1>{kpiData.co2}</h1>
            <p>Tons</p>
          </div>

          <div className="card">
            <h4>SOx Emission</h4>
            <h1>{kpiData.sox}</h1>
            <p>ppm</p>
          </div>

          <div className="card">
            <h4>NOx Emission</h4>
            <h1>{kpiData.nox}</h1>
            <p>ppm</p>
          </div>

          <div className="card">
            <h4>PM Level</h4>
            <h1>{kpiData.pm}</h1>
            <p>mg/Nm³</p>
          </div>

          <div className="card">
            <h4>ESG Score</h4>
            <h1>{kpiData.esg}</h1>
            <p>/100</p>
          </div>

          <div className="card">
            <h4>Sustainability</h4>
            <h1>{kpiData.sustainability}</h1>
            <p>/100</p>
          </div>

        </section>
        {/* PLANT STATUS */}

<section className="plant-status">

  {
    plantData.map((plant,index)=>(

      <div
        key={index}
        className="status-card"
      >

        <h3>
          {plant.unit}
        </h3>

        <p>
          {plant.type}
        </p>

        <span
          className={
            plant.status==="Operational"
            ? "online"
            : plant.status==="Maintenance"
            ? "maintenance"
            : "critical"
          }
        >
          {plant.status}
        </span>

      </div>

    ))
  }

</section>
<section
    style={{
        padding:"0 30px 30px 30px"
    }}
>
    <EmissionChart />
</section>
        
    {/* ENVIRONMENTAL SUMMARY */}

<section className="summary">

    <div className="summary-card">
        <h3>Carbon Footprint</h3>
        <h1>5400</h1>
        <p>Tons CO₂/year</p>
    </div>

    <div className="summary-card">
        <h3>Water Efficiency</h3>
        <h1>72%</h1>
        <p>Resource utilization</p>
    </div>

    <div className="summary-card">
        <h3>Waste Recycling</h3>
        <h1>89%</h1>
        <p>Recovered material</p>
    </div>

    <div className="summary-card">
        <h3>Energy Efficiency</h3>
        <h1>84%</h1>
        <p>Plant performance</p>
    </div>

</section>

        {/* ALERTS */}

        <section className="alert-box">

          <div className="alert-header">
            <h2>Environmental Alerts</h2>
          </div>

          <table>

            <thead>
              <tr>
                <th>Unit</th>
                <th>Pollutant</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

{
  alerts.map((alert,index)=>(
    <tr key={index}>

      <td>
        {alert.unit}
      </td>

      <td>
        {alert.pollutant}
      </td>

      <td>
        {alert.value}
      </td>

      <td
        className={
          alert.status === "Critical"
          ? "danger"
          : "warning"
        }
      >
        {alert.status}
      </td>

    </tr>
  ))
}

</tbody>

          </table>

        </section>
        {/* BOTTOM ANALYTICS */}

<section className="bottom-panels">

  {/* ESG */}

  <div className="panel">

    <h3>ESG Summary</h3>

    <div className="score">
      Environmental
      <span>{esgData.environmental}</span>
    </div>

    <div className="score">
      Social
      <span>{esgData.social}</span>
    </div>

    <div className="score">
      Governance
      <span>{esgData.governance}</span>
    </div>

    <div className="score total">
      Overall
      <span>{esgData.overall}</span>
    </div>

  </div>

  {/* PLANT */}

 {/* PLANT OVERVIEW */}

<div className="panel">

    <h3>Plant Overview</h3>

    <div className="score">
        Blast Furnaces
        <span>
            {
                plantData.filter(
                    plant => plant.type === "Blast Furnace"
                ).length
            }
        </span>
    </div>

    <div className="score">
        Power Plants
        <span>
            {
                plantData.filter(
                    plant => plant.type === "Power Plant"
                ).length
            }
        </span>
    </div>

    <div className="score">
        Operational Units
        <span>
            {
                plantData.filter(
                    plant => plant.status === "Operational"
                ).length
            }
        </span>
    </div>

    <div className="score">
        Units Under Maintenance
        <span>
            {
                plantData.filter(
                    plant => plant.status === "Maintenance"
                ).length
            }
        </span>
    </div>

    <div className="score">
        Warning Units
        <span>
            {
                plantData.filter(
                    plant => plant.status === "Warning"
                ).length
            }
        </span>
    </div>

    <div className="score total">
        Total Units
        <span>
            {plantData.length}
        </span>
    </div>

</div>

  {/* ACTIVITY */}

{/* RECENT ACTIVITY */}

<div className="panel">

    <h3>Recent Activity</h3>

    <ul className="activity">

        {
            activityData.map(
                (activity, index) => (
                    <li key={index}>
                        <div className="activity-item">

                            <div className="activity-dot"></div>

                            <span>
                                {activity}
                            </span>

                        </div>
                    </li>
                )
            )
        }

    </ul>
</div>

</section>
</main>
</div>
  );
}