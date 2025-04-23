const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");
const { publishOrder } = require("../services/rabbitmq");
const orderService = require("../services/orderService"); // Correctly import the service

// Create a new order (already existing)
router.post("/", authenticate, orderController.createOrder);

// Get all orders for a restaurant (already existing)
router.get("/:restaurantId", authenticate, orderController.getOrders);

// Update order status (already existing)
router.patch("/:orderId", authenticate, orderController.updateOrder);

// New route to handle order placement and publishing to RabbitMQ
router.post("/checkout", authenticate, async (req, res) => {
  const orders = req.body.orders; // Now we expect orders to be inside the body of the request
  const userId = req.user.id;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Orders must be a non-empty array" });
  }

  try {
    const createdOrders = [];

    for (const order of orders) {
      const { restaurantId, menuItems } = order;

      if (!restaurantId || !menuItems || menuItems.length === 0) {
        return res.status(400).json({ error: "Missing required fields in one of the orders" });
      }

      const newOrder = await orderService.createOrder([{
        restaurantId,
        menuItems,
        userId,
      }]); // Pass the orders array directly to the service

      createdOrders.push(newOrder);
    }

    res.status(201).json({ message: "Orders placed successfully", orders: createdOrders });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
