import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader3D from "../components/ui/Loader3D";

const CatchAllRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader3D label="Loading GreenSteel..." minHeight="100vh" />;
    }

    return (
        <Navigate
            to={isAuthenticated ? "/dashboard" : "/"}
            replace
        />
    );
};

export default CatchAllRoute;
