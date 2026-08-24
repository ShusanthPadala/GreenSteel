import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Departments from "../pages/Departments/Departments";
import Layout from "../components/layout/Layout";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import CatchAllRoute from "./CatchAllRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />

            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/departments"
                    element={<Departments />}
                />
            </Route>

            <Route
                path="*"
                element={<CatchAllRoute />}
            />
        </Routes>
    );
};

export default AppRoutes;
