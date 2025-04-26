const User = require('../models/User'); // Assuming your user model is in userModel.js

// Get all users (requires authentication and admin role)
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'system-admin') {
            return res.status(403).json({ message: 'Not authorized to access all users' });
        }
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers };