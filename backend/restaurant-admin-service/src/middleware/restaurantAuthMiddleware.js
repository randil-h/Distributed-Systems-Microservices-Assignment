const axios = require('axios');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log("Received token:", token);
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const response = await axios.get('http://localhost:6969/api/auth/verify', {
            headers: { Authorization: token }
        });

        if (!response.data || !response.data.user) {
            console.error("Invalid response from auth service:", response.data);
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = response.data.user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authorizeRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
};

module.exports = { authenticate, authorizeRole };  const mongoose = require('mongoose');