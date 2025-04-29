import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
       localStorage.setItem('restaurantId', response.data.restaurantId);
    }
    return response.data;
};

export const register = async (name, email, password, role, restaurantId) => {
    return axios.post(`${API_URL}/register`, { name, email, password, role, restaurantId });
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  localStorage.removeItem("restaurantId");
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");

export const isAuthenticated = () => !!getToken();
