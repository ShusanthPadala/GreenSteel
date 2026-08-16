import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "../../contexts/AuthContext";
import dashboardService from "../../services/dashboardService";

import DashboardKPICards from "../../components/cards/DashboardKPICards";
import DashboardEmissionTrendChart from "../../components/charts/DashboardEmissionTrendChart";


import "./dashboard.css";

const Dashboard = () => {

    const { user } = useAuth();

    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const summaryData =
                    await dashboardService.getSummary();

                const trendData =
                    await dashboardService.getTrends();

                setSummary(summaryData);

                setTrends(trendData);

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    const greeting = () => {

        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";

        return "Good Evening";

    };

    if (loading) {

        return <h2>Loading Dashboard...</h2>;

    }

    return (

        <motion.div
            className="dashboard-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .5 }}
        >

            <motion.section
                className="dashboard-hero"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .45 }}
            >

                <div className="dashboard-hero-left">

                    <span className="hero-chip">

                        Environmental Monitoring Platform

                    </span>

                    <motion.h1
                        whileHover={{
                            y: -2,
                            transition: { duration: .2 }
                        }}
                    >

                        {greeting()}, {user?.firstName}

                    </motion.h1>

                    <p>

                        Monitor emissions, ESG performance and sustainability
                        from one intelligent dashboard.

                    </p>

                </div>

                <motion.div
                    whileHover={{
                        scale: 1.05
                    }}
                    className="hero-status"
                >

                    <span className="hero-status-dot"></span>

                    Plant Operational

                </motion.div>

            </motion.section>

            <DashboardKPICards summary={summary} />

            <div className="dashboard-main-grid">

                <DashboardEmissionTrendChart
                    trends={trends}
                />

            </div>

        </motion.div>

    );

};

export default Dashboard;