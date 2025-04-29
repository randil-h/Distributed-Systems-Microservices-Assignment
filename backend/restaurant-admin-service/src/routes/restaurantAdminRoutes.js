const express = require('express');
const router = express.Router();
const { registerRestaurant, updateRestaurant, getRestaurant, deleteRestaurant,getAllRestaurants, getPendingRestaurants } = require('../controller/restaurantAdminController');
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

router.get('/pending',
  authenticate,
  authorizeRole(['system-admin']),
  getPendingRestaurants
);

router.get('/:id',
    getRestaurant
);

router.delete('/:id',
    authenticate,
    authorizeRole(['restaurant-admin', 'system-admin']),
    deleteRestaurant
);
router.get("/",

    getAllRestaurants);

module.exports = router;
