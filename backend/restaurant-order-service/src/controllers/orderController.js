const orderService = require("../services/orderService");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { restaurantId, menuItemId, quantity } = req.body;
    const userId = req.user.id;

    if (!restaurantId || !menuItemId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder = await orderService.createOrder({
      restaurantId,
      menuItemId,
      quantity,
      userId
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all orders for a restaurant
const getOrders = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const orders = await orderService.getOrdersByRestaurant(restaurantId);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update order status (e.g., from "pending" to "completed")
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Order status is required" });
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder
};
