const amqp = require('amqplib');
const Order = require('../models/order');  // Order model

// Function to start RabbitMQ consumer and process incoming orders
async function startRabbitMQConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'orders';  // Queue to consume from

    await channel.assertQueue(queue, { durable: true });
    console.log('Waiting for orders in queue:', queue);

    // Consume orders
    channel.consume(queue, async (msg) => {
      if (msg) {
        const orderData = JSON.parse(msg.content.toString());
        console.log('Received order:', orderData);

        // Save order to the local database
        const newOrder = new Order(orderData);
        await newOrder.save();
        channel.ack(msg);  // Acknowledge the message after saving
      }
    });
  } catch (error) {
    console.error('Error in consuming orders:', error);
  }
}

// Fetch orders for a specific restaurant
async function getOrders(restaurantId) {
  try {
    return await Order.find({ restaurantId }).sort({ createdAt: -1 }); // Get orders sorted by date
  } catch (error) {
    throw new Error('Error fetching orders: ' + error.message);
  }
}

// Update the order status
async function updateOrderStatus(orderId, status) {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();
    return order;
  } catch (error) {
    throw new Error('Error updating order status: ' + error.message);
  }
}

module.exports = {
  startRabbitMQConsumer,
  getOrders,
  updateOrderStatus
};
