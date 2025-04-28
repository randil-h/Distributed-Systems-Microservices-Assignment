const Order = require("../models/Order");
const { publishOrder, publishPaymentDetails } = require("./rabbitmq");

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

/**
 * Get order price by order ID
 * @param {String} orderId - Order ID
 * @returns {Number} Order total amount in cents
 */
const getOrderPriceById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Return the total amount in cents (for Stripe)
    return Math.round(order.totalAmount * 100);
  } catch (error) {
    console.error(`Error fetching order price: ${error.message}`);
    throw error;
  }
};

/**
 * Send order price details to payment service via RabbitMQ
 * @param {String} orderId - Order ID
 */
const sendOrderPriceToPaymentService = async (orderId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Send order details to payment service via RabbitMQ
    await publishPaymentDetails({
      orderId: order._id.toString(),
      amount: Math.round(order.totalAmount * 100), // Convert to cents for Stripe
      currency: "usd", // Default currency
      timestamp: new Date()
    });

    console.log(`Order ${orderId} price details sent to payment service`);
    return true;
  } catch (error) {
    console.error(`Error sending order price to payment service: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrdersByRestaurant,
  updateOrderStatus,
  getOrderPriceById,
  sendOrderPriceToPaymentService
};