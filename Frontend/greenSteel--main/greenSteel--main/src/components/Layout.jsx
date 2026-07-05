import { Outlet, Link } from "react-router-dom";

import {
    FaChartPie,
    FaIndustry,
    FaFire,
    FaCog,
    FaBolt,
    FaLeaf,
    FaExclamationTriangle,
    FaFileAlt,
    FaMicrophone
} from "react-icons/fa";

export default function Layout() {

    return (

        <div className="dashboard">

            <main className="main">

                <Outlet />

            </main>

        </div>

    );

}