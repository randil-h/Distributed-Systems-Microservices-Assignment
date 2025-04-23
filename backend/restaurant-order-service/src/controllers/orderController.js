const orderService = require("../services/orderService");
const { publishOrder } = require("../services/rabbitmq");

// Create orders in bulk (handle multiple restaurants in one request)
const createOrder = async (req, res) => {
  try {
    const { orders } = req.body; // This should be an array of orders

    if (!orders || orders.length === 0) {
      return res.status(400).json({ error: "Orders must be a non-empty array" });
    }

    // Validate each order
    for (let orderData of orders) {
      const { restaurantId, menuItems } = orderData;

      if (!restaurantId || !menuItems || menuItems.length === 0) {
        return res.status(400).json({ error: "Missing required fields for an order" });
      }

      // Validate each menu item
      for (let item of menuItems) {
        const { id: menuItemId, quantity } = item;

        if (!menuItemId || !quantity) {
          return res.status(400).json({ error: "Missing menu item ID or quantity" });
        }
      }
    }

    // Pass the orders to the service
    const createdOrders = await orderService.createOrder({ orders });

    res.status(201).json(createdOrders); // Return all created orders
  } catch (error) {
    console.error("Error creating orders:", error);
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
