import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
    return (
        <div className="app-layout">

            <Sidebar />

            <div className="app-main">

                <Navbar />

                <main className="page-content">
                    <Outlet />
                </main>

                <Footer />

            </div>

        </div>
    );
}

export default Layout;