const orderService = require('../services/orderService');

// Controller to get all orders for a restaurant
async function getOrders(req, res) {
  // const restaurantId = req.user.restaurantId; // Assumes the restaurantId is set in the user (via middleware)
  const restaurantId = '67ebce7d6bbf6764f48efe73';

  try {
    const orders = await orderService.getOrders(restaurantId);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Controller to update the status of an order
async function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getOrders,
  updateOrderStatus
};
