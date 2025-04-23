const Order = require("../models/Order");

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
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
