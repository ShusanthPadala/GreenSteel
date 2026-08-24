export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
    const data = error?.response?.data;

    if (typeof data?.message === "string" && data.message.trim()) {
        return data.message;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
        return data.error;
    }

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (error?.code === "ERR_NETWORK") {
        return "Unable to reach the server. Confirm the backend is running.";
    }

    return fallback;
};

export const getLoginErrorMessage = (error) => {
    const status = error?.response?.status;

    if (status === 400) {
        const data = error?.response?.data;

        if (data?.data && typeof data.data === "object") {
            const firstFieldMessage = Object.values(data.data).find(
                (value) => typeof value === "string"
            );

            if (firstFieldMessage) {
                return firstFieldMessage;
            }
        }

        return getApiErrorMessage(error, "Please check your email and password.");
    }

    if (status === 401 || status === 403) {
        return getApiErrorMessage(error, "Invalid email or password.");
    }

    return getApiErrorMessage(error, "Unable to sign in. Please try again.");
};
