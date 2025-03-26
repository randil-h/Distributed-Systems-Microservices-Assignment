const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// Add a new restaurant
exports.addRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;
    const ownerId = req.user.id; // Extracted from JWT token

    const newRestaurant = new Restaurant({ name, address, ownerId });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Error adding restaurant", error });
  }
};

// Get all restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
};

// Add a menu item to a restaurant
exports.addMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, description, price, category } = req.body;
    const ownerId = req.user.id;

    // Verify that the restaurant belongs to the authenticated owner
    const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "Unauthorized to add menu items for this restaurant" });
    }

    const newItem = new MenuItem({ restaurantId, name, description, price, category });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error });
  }
};

// Get all menu items for a restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({ restaurantId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
};
