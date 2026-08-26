import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { clearAuth, getStoredUser, getToken, saveAuth } from '../utils/authStorage';
import { getLoginErrorMessage } from '../utils/apiError';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    const timer = setTimeout(() => {
      if (getToken() && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data && response.data.success) {
        const userData = response.data.data;

        saveAuth(userData, rememberMe);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: userData };
      } else {
        return {
          success: false,
          message: 'Invalid email or password.'
        };
      }
    } catch (error) {
      return { success: false, message: getLoginErrorMessage(error) };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
