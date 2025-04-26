const Order = require("../models/Order");
const { publishOrder } = require("../services/rabbitmq"); // Import RabbitMQ service

const createOrder = async (orderData) => {
  const createdOrders = [];

  // Iterate through the orders
  for (let order of orderData) {
    const { restaurantId, userId, menuItems, totalAmount } = order;

    if (!menuItems || menuItems.length === 0) {
      throw new Error('Menu items are required');
    }

    // Ensure that each menu item has valid id and quantity
    const items = menuItems.map(item => {
      const { id: menuItemId, quantity } = item;

      if (!menuItemId || !quantity) {
        throw new Error('Menu item ID and quantity are required');
      }

      return {
        menuItemId,
        quantity,
      };
    });

    // Ensure totalAmount is provided
    if (!totalAmount) {
      throw new Error('Total amount is required');
    }

    // Build the order model with the correctly structured items
    const newOrder = new Order({
      restaurantId,
      userId,
      items, // Ensure the items array is properly populated with valid data
      status: 'pending',
      totalAmount,  // Store the totalAmount in the order
    });

    const savedOrder = await newOrder.save();

    // Publish the order to RabbitMQ, including totalAmount
    await publishOrder({
      orderId: savedOrder._id,
      restaurantId,
      userId,
      menuItems: items, // Send as-is, since it already has { menuItemId, quantity }
      totalAmount,  // Include totalAmount in the RabbitMQ message
    });

    createdOrders.push(savedOrder); // Add saved order to the created orders array
  }

  return createdOrders; // Return all created orders
};




const getOrdersByRestaurant = async (restaurantId) => {
  return await Order.find({ restaurantId }).populate("menuItemId");
};

const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

module.exports = {
  createOrder,
  getOrdersByRestaurant,
  updateOrderStatus
};
