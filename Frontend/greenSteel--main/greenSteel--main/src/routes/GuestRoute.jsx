import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader3D from "../components/ui/Loader3D";

const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader3D label="Loading GreenSteel..." minHeight="100vh" />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuestRoute;
