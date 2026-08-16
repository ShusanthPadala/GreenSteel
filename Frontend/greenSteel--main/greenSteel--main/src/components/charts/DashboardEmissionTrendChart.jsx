import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

import "../../styles/dashboardEmissionTrendChart.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

const DashboardEmissionTrendChart = ({ trends = [] }) => {

    if (!trends.length) {

        return (

            <section className="dashboard-emission-chart">

                <h3>No Emission Data Available</h3>

            </section>

        );

    }

    const chartData = {

        labels: trends.map(

            trend => `${trend.month} ${trend.year}`

        ),

        datasets: [

            {
                label: "CO₂",
                data: trends.map(t => t.cox),
                borderColor: "#748560",
                backgroundColor: "rgba(116,133,96,.12)",
                fill: false,
                tension: .4,
                pointRadius: 4
            },

            {
                label: "NOx",
                data: trends.map(t => t.nox),
                borderColor: "#4B82D6",
                backgroundColor: "#4B82D6",
                fill: false,
                tension: .4,
                pointRadius: 4
            },

            {
                label: "SOx",
                data: trends.map(t => t.sox),
                borderColor: "#F39C12",
                backgroundColor: "#F39C12",
                fill: false,
                tension: .4,
                pointRadius: 4
            },

            {
                label: "PM",
                data: trends.map(t => t.pm),
                borderColor: "#D9534F",
                backgroundColor: "#D9534F",
                fill: false,
                tension: .4,
                pointRadius: 4
            }

        ]

    };

    const chartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {

            mode: "index",

            intersect: false,

        },

        plugins: {

            legend: {

                display: true,

                position: "top",

                labels: {

                    usePointStyle: true,

                    boxWidth: 10,

                    font: {

                        size: 13

                    }

                }

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

                    color: "#ECE8DE"

                }

            }

        }

    };

    return (

        <section className="dashboard-emission-chart">

            <div className="dashboard-emission-chart-header">

                <div>

                    <h3>Emission Trend Analysis</h3>

                    <p>Monthly Average Pollutant Levels</p>

                </div>

            </div>

            <div className="dashboard-emission-chart-body">

                <Line

                    data={chartData}

                    options={chartOptions}

                />

            </div>

        </section>

    );

};

export default DashboardEmissionTrendChart;