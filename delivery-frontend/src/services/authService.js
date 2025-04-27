import axios from 'axios';


export const login = async (email, password) => {
    try {
        const res = await axios.post(`http://localhost:6969/api/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const register = async (email, password, name) => {
    try {
        await axios.post(`http://localhost:6969/api/auth/register`, { email, name, password, role: "delivery-personnel"  });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
