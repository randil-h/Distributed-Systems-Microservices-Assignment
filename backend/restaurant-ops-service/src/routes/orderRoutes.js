const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Route to get all orders
router.get('/orders', orderController.getOrders);

// Route to update order status
router.patch('/orders/:orderId/status', orderController.updateOrderStatus);

module.exports = router;
