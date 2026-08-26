import api, { unwrapApiResponse } from "./api";

const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    return unwrapApiResponse(response.data);
};

const authService = {
    login,
    forgotPassword: async (email) => {
        const response = await api.post("/api/auth/forgot-password", { email });
        return unwrapApiResponse(response.data);
    },
    resetPassword: async (token, newPassword) => {
        const response = await api.post("/api/auth/reset-password", { token, newPassword });
        return unwrapApiResponse(response.data);
    },
};

export default authService;
