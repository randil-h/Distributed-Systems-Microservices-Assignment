const Restaurant = require('../models/restaurantModel');

// Register a new restaurant
const registerRestaurant = async (req, res) => {
    try {
        console.log("Received req.body:", req.body);
        console.log("req.user.role: ", req.user.role);
        console.log("req.user.id: ", req.user.id);

        const {
            name,
            legalBusinessName,
            registrationNumber,
            description,
            cuisineType,
            restaurantCategory,
            address,
            phone,
            email,
            website,
            facebook,
            instagram,
            operatingHours,
            deliveryOptions,
            paymentMethods,
            ownerName,
            ownerEmail,
            ownerPhone,
            logo,
            coverImage,
        } = req.body;

        const restaurant = new Restaurant({
            name,
            legalBusinessName,
            registrationNumber,
            description,
            cuisineType,
            restaurantCategory,
            address,
            phone,
            email,
            website,
            facebook,
            instagram,
            operatingHours,
            deliveryOptions,
            paymentMethods,
            ownerName,
            ownerEmail,
            ownerPhone,
            ownerId: req.user.id,
            logo,
            coverImage,
        });

        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        console.error("Error registering restaurant:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update a restaurant (only owner or admin can update)
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const isOwner = restaurant.ownerId.toString() === req.user.id;
        const isAdmin = req.user.role === 'system-admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        // Allow all fields to be updated by the owner, but restrict status updates to admin
        const updateData = isOwner ? { ...req.body } : {};
        if (isAdmin) {
            updateData.registrationStatus = req.body.registrationStatus;
            updateData.rejectionReason = req.body.rejectionReason;
            // Optionally, allow admins to update other fields as well
            Object.keys(req.body).forEach(key => {
                if (!['registrationStatus', 'rejectionReason'].includes(key)) {
                    updateData[key] = req.body[key];
                }
            });
        } else {
            // For owners, only allow updating non-status related fields
            Object.keys(req.body).forEach(key => {
                if (!['registrationStatus', 'rejectionReason'].includes(key)) {
                    updateData[key] = req.body[key];
                }
            });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a restaurant
const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a restaurant (only owner can delete)
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        if (restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
        }

        await Restaurant.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            message: 'Server error during deletion',
            error: error.message
        });
    }
};

// Get all restaurants (requires authentication)
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pending restaurants (requires authentication)
const getPendingRestaurants = async (req, res) => {
    try {
        const pendingRestaurants = await Restaurant.find({ registrationStatus: 'pending' });
        res.json(pendingRestaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { registerRestaurant, updateRestaurant, getRestaurant, deleteRestaurant, getAllRestaurants, getPendingRestaurants };