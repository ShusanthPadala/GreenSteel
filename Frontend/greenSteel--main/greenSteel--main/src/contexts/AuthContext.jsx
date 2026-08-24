import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "../services/api";
import { clearAuth, getStoredUser, getToken, saveAuth } from "../utils/authStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        clearAuth();
        setUser(null);
    }, []);

    useEffect(() => {
        const token = getToken();
        const storedUser = getStoredUser();

        if (token && storedUser) {
            setUser(storedUser);
        } else {
            clearAuth();
            setUser(null);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            logout();
            navigate("/", { replace: true });
        });

        return () => setUnauthorizedHandler(null);
    }, [logout, navigate]);

    const login = (userData, rememberMe = true) => {
        saveAuth(userData, rememberMe);
        setUser(userData);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!(user && getToken()),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
