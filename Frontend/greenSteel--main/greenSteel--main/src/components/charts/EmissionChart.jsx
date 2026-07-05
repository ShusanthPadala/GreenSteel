import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

import { emissionData } from "../../data/emissionData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function EmissionChart() {

  const data = {

    labels: emissionData.map(
      item => item.month
    ),

    datasets: [

      {
        label: "CO₂",

        data: emissionData.map(
          item => item.co2
        ),

        borderColor: "#16A34A",

        backgroundColor:
          "rgba(22,163,74,0.15)",

        tension: 0.4,

        fill: true,

        pointRadius: 4
      },

      {
        label: "SOx",

        data: emissionData.map(
          item => item.sox
        ),

        borderColor: "#2563EB",

        backgroundColor:
          "rgba(37,99,235,0.1)",

        tension: 0.4,

        pointRadius: 4
      },

      {
        label: "NOx",

        data: emissionData.map(
          item => item.nox
        ),

        borderColor: "#F59E0B",

        backgroundColor:
          "rgba(245,158,11,0.1)",

        tension: 0.4,

        pointRadius: 4
      },

      {
        label: "PM",

        data: emissionData.map(
          item => item.pm
        ),

        borderColor: "#EF4444",

        backgroundColor:
          "rgba(239,68,68,0.1)",

        tension: 0.4,

        pointRadius: 4
      }

    ]
  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "top"
      }

    },

    scales: {

      x: {

        grid: {
          display: false
        }

      },

      y: {

        beginAtZero: true,

        grid: {
          color: "#E2E8F0"
        }

      }

    }

  };

  return (

    <div
      className="chart-container"
    >

      <h2>
        Emission Trends
      </h2>

      <div
        style={{
          height: "400px"
        }}
      >

        <Line
          data={data}
          options={options}
        />

      </div>

    </div>

  );
}