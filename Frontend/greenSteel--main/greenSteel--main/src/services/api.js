import axios from "axios";
import { getToken, clearAuth } from "../utils/authStorage";
import { getApiErrorMessage } from "../utils/apiError";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

const isLoginRequest = (config) => {
    const url = config?.url || "";
    return url.includes("/auth/login");
};

api.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        error.userMessage = getApiErrorMessage(
            error,
            status === 403
                ? "You do not have permission to perform this action."
                : "Something went wrong."
        );

        if (status === 403) {
            error.userMessage = getApiErrorMessage(
                error,
                "You do not have permission to perform this action."
            );
        }

        if (status === 401 && !isLoginRequest(error.config)) {
            clearAuth();

            if (typeof onUnauthorized === "function") {
                onUnauthorized();
            } else if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
