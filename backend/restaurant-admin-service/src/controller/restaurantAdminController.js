const Restaurant = require('../models/restaurantModel');

// Register a new restaurant
const registerRestaurant = async (req, res) => {
    try {
        const { name, address, operatingHours, ownerId } = req.body;
        const restaurant = new Restaurant({ name, address, operatingHours, ownerId });
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a restaurant
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a restaurant
const getRestaurant = async (req, res) => {
    try{
        const restaurant = await Restaurant.findById(req.params.id);
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Delete a restaurant
const deleteRestaurant = async (req,res) =>{
    try{
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        res.json({message:"resturant deleted"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = { registerRestaurant, updateRestaurant, getRestaurant, deleteRestaurant };