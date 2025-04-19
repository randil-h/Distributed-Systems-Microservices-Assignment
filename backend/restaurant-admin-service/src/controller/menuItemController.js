// controllers/menuItemController.js
const MenuItem = require('../models/menuItemModel');
const Restaurant = require('../models/restaurantModel');
const { authenticate, authorizeRole } = require('../middleware/restaurantAuthMiddleware');

// Create a new menu item
const createMenuItem = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.body.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if the user owns the restaurant
        if (req.user.role !== 'system-admin' && restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add menu items to this restaurant' });
        }

        const menuItem = new MenuItem({
            ...req.body,
            restaurantId: req.body.restaurantId
        });

        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all menu items for a restaurant
const getMenuItemsByRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Only allow restaurant owner or system admin to view menu
        if (req.user.role !== 'system-admin' && restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this menu' });
        }

        const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        const restaurant = await Restaurant.findById(menuItem.restaurantId);

        // Check if the user owns the restaurant
        if (req.user.role !== 'system-admin' && restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this menu item' });
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedMenuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        const restaurant = await Restaurant.findById(menuItem.restaurantId);

        // Check if the user owns the restaurant
        if (req.user.role !== 'system-admin' && restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this menu item' });
        }

        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMenuItem,
    getMenuItemsByRestaurant,
    updateMenuItem,
    deleteMenuItem
};