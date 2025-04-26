const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

const { filterByRestaurant } = require('../middleware/restaurantStaffMiddleware');
const {authenticate, authorizeRole} = require("../middleware/authMiddleware");

console.log('Imported controller:', typeof orderController.getOrders);

// Route to get all orders with proper access control
router.get('/',
  authenticate,
  authorizeRole(['customer', 'restaurant-staff', 'restaurant-admin', 'delivery-personnel']),
  orderController.getOrders
);

// Route to update order status
router.patch('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;
