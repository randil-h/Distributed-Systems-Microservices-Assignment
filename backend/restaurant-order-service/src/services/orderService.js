// services/orderService.js
const Order = require("../models/Order");
const { publishOrder } = require("./rabbitmq");

/**
 * Create new orders
 * @param {Array} orders - Array of order data
 * @returns {Array} Created orders
 */
const createOrder = async (orders) => {
  const createdOrders = [];

  for (let order of orders) {
    const { restaurantId, userId, menuItems, totalAmount, deliveryLocation } = order;

    if (!menuItems || menuItems.length === 0) {
      throw new Error('Menu items are required');
    }

    if (!totalAmount) {
      throw new Error('Total amount is required');
    }

    if (!deliveryLocation || !deliveryLocation.lat || !deliveryLocation.lng) {
      throw new Error('Delivery location is required');
    }

    // Format items for saving
    const items = menuItems.map(item => {
      const { id: menuItemId, quantity } = item;

      if (!menuItemId || !quantity) {
        throw new Error('Menu item ID and quantity are required');
      }

      return { menuItemId, quantity };
    });

    // Create and save order
    const newOrder = new Order({
      restaurantId,
      userId,
      items,
      status: 'pending',
      totalAmount,
      deliveryLocation
    });

    const savedOrder = await newOrder.save();

    // Publish order to all three queues via RabbitMQ
    await publishOrder({
      orderId: savedOrder._id,
      restaurantId,
      userId,
      menuItems: items,
      totalAmount,
      deliveryLocation // Include delivery location in the message
    });

    createdOrders.push(savedOrder);
  }

  return createdOrders;
};

/**
 * Get orders for a specific restaurant
 * @param {String} restaurantId - Restaurant ID
 * @returns {Array} Restaurant orders
 */
const getOrdersByRestaurant = async (restaurantId) => {
  return await Order.find({ restaurantId }).populate("items.menuItemId");
};

/**
 * Update order status
 * @param {String} orderId - Order ID
 * @param {String} status - New status
 * @returns {Object} Updated order
 */
const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

module.exports = {
  createOrder,
  getOrdersByRestaurant,
  updateOrderStatus
};
