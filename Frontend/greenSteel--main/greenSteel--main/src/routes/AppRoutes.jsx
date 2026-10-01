import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Loader3D from "../components/ui/Loader3D";

// Pages load on demand so the first screen appears faster
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Departments = lazy(() => import("../pages/Departments/Departments"));
const Users = lazy(() => import("../pages/Users"));
const Roles = lazy(() => import("../pages/Roles"));
const Units = lazy(() => import("../pages/Units"));
const EmissionTypes = lazy(() => import("../pages/EmissionTypes"));
const EmissionRecords = lazy(() => import("../pages/EmissionRecords"));
const Alerts = lazy(() => import("../pages/Alerts"));
const Reports = lazy(() => import("../pages/Reports"));
const ESG = lazy(() => import("../pages/ESG"));
const Settings = lazy(() => import("../pages/Settings"));
const PlantMap = lazy(() => import("../pages/PlantMap/PlantMap"));
import Layout from "../components/Layout";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import CatchAllRoute from "./CatchAllRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader3D label="Loading..." minHeight="60vh" />}>
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

                <Route path="/departments" element={<RoleRoute page="departments"><Departments /></RoleRoute>} />
                <Route path="/users" element={<RoleRoute page="users"><Users /></RoleRoute>} />
                <Route path="/roles" element={<RoleRoute page="roles"><Roles /></RoleRoute>} />
                <Route path="/units" element={<RoleRoute page="units"><Units /></RoleRoute>} />
                <Route path="/emission-types" element={<RoleRoute page="emission-types"><EmissionTypes /></RoleRoute>} />
                <Route path="/emission-records" element={<RoleRoute page="emission-records"><EmissionRecords /></RoleRoute>} />
                <Route path="/alerts" element={<RoleRoute page="alerts"><Alerts /></RoleRoute>} />
                <Route path="/reports" element={<RoleRoute page="reports"><Reports /></RoleRoute>} />
                <Route path="/esg" element={<RoleRoute page="esg"><ESG /></RoleRoute>} />
                <Route path="/plant-map" element={<RoleRoute page="plant-map"><PlantMap /></RoleRoute>} />
                <Route path="/settings" element={<RoleRoute page="settings"><Settings /></RoleRoute>} />
            </Route>

            <Route
                path="*"
                element={<CatchAllRoute />}
            />
        </Routes>
        </Suspense>
    );
};

export default AppRoutes;
