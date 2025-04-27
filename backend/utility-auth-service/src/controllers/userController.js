const User = require('../models/User'); // Assuming your user model is in userModel.js
const mongoose = require('mongoose');

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

const checkAndUnblockUser = async (userId) => { //must run at login attempt before the user logs in
    const user = await User.findById(userId);
    if (user && user.isBlocked && user.blockExpiry && new Date() > new Date(user.blockExpiry)) {
        user.isBlocked = false;
        user.blockExpiry = null;
        await user.save();
    }
};

const updateBlockStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked, blockDuration, durationUnit } = req.body;

        console.log('Received userId:', id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid id format.' });
        }

        if (typeof isBlocked !== 'boolean' || !blockDuration || !['hours', 'days'].includes(durationUnit)) {
            return res.status(400).json({ message: 'Invalid input.' });
        }

        let blockExpiry = null;
        if (isBlocked) {
            const now = new Date();
            blockExpiry = new Date(now.getTime() + (
                durationUnit === 'hours'
                    ? blockDuration * 60 * 60 * 1000
                    : blockDuration * 24 * 60 * 60 * 1000
            ));
        }

        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isBlocked, blockExpiry },
            { new: true }
        );

        res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { getAllUsers, checkAndUnblockUser, updateBlockStatus };