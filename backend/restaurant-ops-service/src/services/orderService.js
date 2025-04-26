const amqp = require('amqplib');
const Order = require('../models/Order');
const MenuItem = require('../models/menuItemModel');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'order_created';

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
async function getOrders(query) {
  try {
    return await Order.find(query)
      .sort({ createdAt: -1 }); // Newest first
  } catch (error) {
    console.error('OrderService Error:', error);
    throw new Error('Failed to fetch orders: ' + error.message);
  }
}



// async function getOrders() {
//   let connection, channel;
//   const orders = [];
//
//   try {
//     connection = await amqp.connect(RABBITMQ_URL);
//     channel = await connection.createChannel();
//     await channel.assertQueue(QUEUE_NAME, { durable: true });
//
//     // Consume messages without acknowledging them (so they remain in the queue)
//     await channel.consume(QUEUE_NAME, (msg) => {
//       if (msg) {
//         const orderData = JSON.parse(msg.content.toString());
//         orders.push(orderData);
//
//         // Requeue the message so it stays in the queue for other consumers
//         channel.nack(msg, false, true);
//       }
//     }, { noAck: false });
//
//     // Wait for a short period to accumulate some messages
//     // You can adjust this timeout based on your needs
//     await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms for messages
//
//     // Close the channel and connection
//     await channel.close();
//     await connection.close();
//
//     return orders;
//   } catch (err) {
//     console.error('Failed to read from RabbitMQ queue:', err);
//     if (channel) await channel.close();
//     if (connection) await connection.close();
//     throw new Error('Unable to fetch orders from queue');
//   }
// }


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
