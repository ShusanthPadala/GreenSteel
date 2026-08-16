import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";

import Layout from "../components/layout/Layout";
import Departments from "../pages/Departments/Departments";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Route */}

            <Route
                path="/"
                element={<Login />}
            />

            {/* Protected Routes */}

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

                {/* Future Pages */}

                {/*
                <Route path="/users" element={<Users />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/departments" element={<Departments />} />
                */}

            </Route>

            {/* Unknown Route */}

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
};

export default AppRoutes;