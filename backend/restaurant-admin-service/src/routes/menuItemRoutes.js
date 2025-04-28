// routes/menuItemRoutes.js
const express = require('express');
const router = express.Router();
const {
    createMenuItem,
    getMenuItemsByRestaurant,
    updateMenuItem,
    deleteMenuItem, updateMenuItemAvailability
} = require('../controller/menuItemController');
const { authenticate, authorizeRole } = require('../middleware/restaurantAuthMiddleware');

router.post('/',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    createMenuItem
);

router.get('/restaurant/:restaurantId',
    // authenticate,
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
router.patch('/:id/availability',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    updateMenuItemAvailability
);
module.exports = router;
