// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

// Create orders
router.post("/", authenticate, orderController.createOrder);

// Get orders for a restaurant
router.get("/:restaurantId", authenticate, orderController.getOrders);

// Update order status
router.patch("/:orderId", authenticate, orderController.updateOrder);

// Checkout endpoint (compatible with frontend)
router.post("/checkout", authenticate, orderController.checkout);

module.exports = router;
