import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../../styles/layout.css";

const Layout = () => {
    return (
        <div className="layout">

            <Sidebar />

            <div className="layout-content">

                <Navbar />

                <main className="page-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default Layout;