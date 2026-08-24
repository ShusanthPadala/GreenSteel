const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () =>
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
    const raw =
        localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const saveAuth = (userData, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;

    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, userData.token);
    storage.setItem(USER_KEY, JSON.stringify(userData));
};

export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
};
