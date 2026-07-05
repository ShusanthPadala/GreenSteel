import { Link } from "react-router-dom";
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

export default function Sidebar() {

    return (

        <aside className="sidebar">

           <Link to="/" className="logo">

    <h1>
        GreenSteel
    </h1>

</Link>

            <nav>

                <Link to="/dashboard" className="menu">
                    <FaChartPie />
                    Dashboard
                </Link>

                <Link
                    to="/blast-furnace"
                    className="menu"
                >
                    <FaIndustry />
                    Blast Furnaces
                </Link>

                <Link
                    to="/coke-oven"
                    className="menu"
                >
                    <FaFire />
                    Coke Ovens
                </Link>

                <Link
                    to="/sinter-plant"
                    className="menu"
                >
                    <FaCog />
                    Sinter Plant
                </Link>

                <Link
                    to="/sms"
                    className="menu"
                >
                    <FaIndustry />
                    Steel Melting Shop
                </Link>

                <Link
                    to="/power-plant"
                    className="menu"
                >
                    <FaBolt />
                    Power Plant
                </Link>

                <Link
                    to="/esg"
                    className="menu"
                >
                    <FaLeaf />
                    ESG
                </Link>

                <Link
                    to="/alerts"
                    className="menu"
                >
                    <FaExclamationTriangle />
                    Alerts
                </Link>

                <Link
                    to="/reports"
                    className="menu"
                >
                    <FaFileAlt />
                    Reports
                </Link>

                <Link
                    to="/voice-assistant"
                    className="menu"
                >
                    <FaMicrophone />
                    Voice Assistant
                </Link>

            </nav>

        </aside>

    );

}