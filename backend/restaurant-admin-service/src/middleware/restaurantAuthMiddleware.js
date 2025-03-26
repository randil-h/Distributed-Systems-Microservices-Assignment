const axios = require('axios');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'No token provided' });

        // Call your auth microservice to verify token
        const response = await axios.get('http://localhost:6969/api/auth', {
            headers: { Authorization: token }
        });

        // Attach user data to request
        req.user = response.data.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authorizeRole = (roles) => async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
};

module.exports = { authenticate, authorizeRole };