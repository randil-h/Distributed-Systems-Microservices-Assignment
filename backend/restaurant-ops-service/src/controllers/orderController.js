const orderService = require('../services/orderService');

// Controller to get all orders for a restaurant
async function getOrders(req, res) {
  try {
    // Initialize base query
    let query = {};

    // Handle different user roles
    switch(req.user.role) {
      case 'customer':
        query.customerId = req.user.id;
        break;

      case 'restaurant-staff':
      case 'restaurant-admin':
        if (!req.user.restaurantId) {
          return res.status(403).json({ message: 'Not assigned to any restaurant' });
        }
        query.restaurantId = req.user.restaurantId;
        break;

      case 'delivery-personnel':
        query.deliveryPersonnelId = req.user.id;
        break;

      default:
        return res.status(403).json({ message: 'Unauthorized role' });
    }

    // Get orders with the constructed query
    const orders = await orderService.getOrders(query);
    res.status(200).json(orders);

  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
