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

const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'system-admin') {
            return res.status(403).json({ message: 'Not authorized to access delete users' });
        }

        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: 'User deleted successfully' });
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

        // If we're unblocking a user, we don't need duration or unit
        if (isBlocked === false) {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { isBlocked: false, blockExpiry: null },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({ message: 'User reactivated successfully.', user: updatedUser });
        }

        // For blocking users, validate blockDuration and durationUnit
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

const updateDriverLocation = async (req, res) => {
    const { lat, lng } = req.body;
    const userId = req.params.id;
    console.log(req.body);

    try {
        const user = await User.findByIdAndUpdate(userId, {
            location: { lat, lng }
        }, { new: true });

        console.log(lat);

        res.status(200).json({
            message: "Location updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, checkAndUnblockUser, updateBlockStatus, updateDriverLocation, deleteUser };