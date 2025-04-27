// routes/menuItemRoutes.js
const express = require('express');
const router = express.Router();
const {
    createMenuItem,
    getMenuItemsByRestaurant,
    updateMenuItem,
    deleteMenuItem
} = require('../controller/menuItemController');
const { authenticate, authorizeRole } = require('../middleware/restaurantAuthMiddleware');

router.post('/',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    createMenuItem
);

router.get('/restaurant/:restaurantId',
    authenticate,
    // authorizeRole(['restaurant-admin', 'system-admin']),
    getMenuItemsByRestaurant
);

router.put('/:id',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    updateMenuItem
);

router.delete('/:id',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    deleteMenuItem
);

module.exports = router;
