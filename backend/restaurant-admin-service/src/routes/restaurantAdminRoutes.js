const express = require('express');
const router = express.Router();
const { registerRestaurant, updateRestaurant, getRestaurant, deleteRestaurant } = require('../controller/restaurantAdminController');
const { authenticate, authorizeRole } = require('../middleware/restaurantAuthMiddleware');

// Apply authentication and authorization middleware
router.post('/register',
    authenticate,
    authorizeRole(['restaurant-admin']),
    registerRestaurant
);

router.put('/:id',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    updateRestaurant
);

router.get('/:id',
    authenticate,
    getRestaurant
);

router.delete('/:id',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    deleteRestaurant
);

module.exports = router;