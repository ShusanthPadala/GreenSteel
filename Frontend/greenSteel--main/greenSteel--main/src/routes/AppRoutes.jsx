import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import Departments from "../pages/Departments/Departments";
import Users from "../pages/Users";
import Roles from "../pages/Roles";
import Units from "../pages/Units";
import EmissionTypes from "../pages/EmissionTypes";
import EmissionRecords from "../pages/EmissionRecords";
import Alerts from "../pages/Alerts";
import Reports from "../pages/Reports";
import ESG from "../pages/ESG";
import Settings from "../pages/Settings";
import Layout from "../components/Layout";

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
                path="/login"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />
            <Route path="/reset-password" element={<ResetPassword />} />

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
                <Route path="/users" element={<Users />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/units" element={<Units />} />
                <Route path="/emission-types" element={<EmissionTypes />} />
                <Route path="/emission-records" element={<EmissionRecords />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/esg" element={<ESG />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            <Route
                path="*"
                element={<CatchAllRoute />}
            />
        </Routes>
    );
};

export default AppRoutes;
