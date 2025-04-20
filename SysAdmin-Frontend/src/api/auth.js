import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6969/api/auth";

axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
        }
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error
    }
};

export const register = async (name, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
        return response.data;
    } catch (error) {
        // Consider logging the error or providing a more user-friendly message
        console.error("Registration failed:", error);
        throw error; // Re-throw the error to be handled by the calling component
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const isAuthenticated = () => !!getToken();

export default {
    login,
    register,
    logout,
    getToken,
    getRole,
    isAuthenticated,
};