// controllers/orderController.js
const orderService = require("../services/orderService");
const Order = require("../models/Order");

/**
 * Create orders
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createOrder = async (req, res) => {
  try {
    const { orders } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: "Orders must be a non-empty array" });
    }

    // Add userId to each order
    const processedOrders = orders.map(order => ({
      ...order,
      userId
    }));

    // Validate orders
    for (let order of processedOrders) {
      const { restaurantId, menuItems, totalAmount, deliveryLocation } = order;

      if (!restaurantId) {
        return res.status(400).json({ error: "Restaurant ID is required" });
      }

      if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
        return res.status(400).json({ error: "Menu items must be a non-empty array" });
      }

      if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ error: "Valid total amount is required" });
      }

      // Validate delivery location
      if (!deliveryLocation || !deliveryLocation.lat || !deliveryLocation.lng) {
        return res.status(400).json({ error: "Valid delivery location is required" });
      }

      // Validate each menu item
      for (let item of menuItems) {
        const { id, quantity } = item;

        if (!id) {
          return res.status(400).json({ error: "Menu item ID is required" });
        }

        if (!quantity || isNaN(quantity) || quantity < 1) {
          return res.status(400).json({ error: "Valid quantity is required" });
        }
      }
    }

    const createdOrders = await orderService.createOrder(processedOrders);
    res.status(201).json(createdOrders);
  } catch (error) {
    console.error("Error creating orders:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Process checkout from the frontend cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const checkout = async (req, res) => {
  try {
    const { orders } = req.body;
    const userId = req.user.id;

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: "Orders must be a non-empty array" });
    }

    const processedOrders = [];

    // Process each order from the frontend format
    for (const order of orders) {
      const { restaurantId, menuItems, totalAmount, tax, shipping, deliveryLocation } = order;

      if (!restaurantId || !menuItems || menuItems.length === 0 || !totalAmount) {
        return res.status(400).json({ error: "Missing required fields in one of the orders" });
      }

      // Validate delivery location
      if (!deliveryLocation || !deliveryLocation.lat || !deliveryLocation.lng) {
        return res.status(400).json({ error: "Delivery location is required" });
      }

      // Convert the frontend menu items format to the format expected by our service
      processedOrders.push({
        restaurantId,
        menuItems,
        userId,
        totalAmount,
        deliveryLocation,
        // Store tax and shipping in metadata if needed
        metadata: {
          tax,
          shipping
        }
      });
    }

    const createdOrders = await orderService.createOrder(processedOrders);
    res.status(201).json({
      message: "Orders placed successfully",
      orders: createdOrders
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

/**
 * Get orders for a restaurant
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

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

// Get all orders (requires authentication)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update order status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Order status is required" });
    }

    const validStatuses = ["pending", "confirmed", "preparing", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
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
  checkout,
  getOrders,
  getAllOrders,
  updateOrder
};
