import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CatchAllRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "20px",
                    fontWeight: "600",
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <Navigate
            to={isAuthenticated ? "/dashboard" : "/"}
            replace
        />
    );
};

export default CatchAllRoute;
