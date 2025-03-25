const express = require('express');
const router = express.Router();
const { registerRestaurant, updateRestaurant, getRestaurant, deleteRestaurant } = require('../controllers/restaurantAdminController');

// Mock authentication (development only)
const mockAuth = (req, res, next) => {
    // For development, assume all requests are authenticated as restaurant admin.
    req.user = { role: 'restaurant admin' }; // Simulate user role
    next();
};

router.post('/register', mockAuth, registerRestaurant); // Use mockAuth middleware
router.put('/:id', mockAuth, updateRestaurant);
router.get('/:id', mockAuth, getRestaurant);
router.delete('/:id', mockAuth, deleteRestaurant);

module.exports = router;