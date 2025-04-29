const amqp = require("amqplib");
const orderService = require("../services/orderService");

let channel, connection;
const queueName = "order_created";
const queueNameForPaymentService = "order_created_payment";
const queueNameForDeliveryService = "order_created_delivery";
const paymentDetailsQueue = "order_payment_details";
const paymentSuccessQueue = "payment_success";

const connectRabbit = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();

    // Assert all queues
    await channel.assertQueue(queueName, { durable: true });
    await channel.assertQueue(queueNameForPaymentService, { durable: true });
    await channel.assertQueue(queueNameForDeliveryService, { durable: true });
    await channel.assertQueue(paymentDetailsQueue, { durable: true });
    await channel.assertQueue(paymentSuccessQueue, { durable: true });

    console.log("Order Service: Connected to RabbitMQ");

    // Set up consumer for payment success events
    await consumePaymentSuccessEvents();
  } catch (err) {
    console.error("Order Service: Failed to connect to RabbitMQ", err);
  }
};

const publishOrder = async (order) => {
  if (!channel) {
    await connectRabbit();
  }

  // Publish to all three queues
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(order)), {
    persistent: true
  });

  channel.sendToQueue(queueNameForPaymentService, Buffer.from(JSON.stringify(order)), {
    persistent: true
  });

  channel.sendToQueue(queueNameForDeliveryService, Buffer.from(JSON.stringify(order)), {
    persistent: true
  });

  console.log("Order published to RabbitMQ:", order);
};

const publishPaymentDetails = async (paymentDetails) => {
  if (!channel) {
    await connectRabbit();
  }

  channel.sendToQueue(paymentDetailsQueue, Buffer.from(JSON.stringify(paymentDetails)), {
    persistent: true
  });

  console.log("Order payment details published to RabbitMQ:", paymentDetails);
};

// Consume payment success events and update order status
const consumePaymentSuccessEvents = async () => {
  if (!channel) {
    await connectRabbit();
  }

  channel.consume(paymentSuccessQueue, async (message) => {
    if (message !== null) {
      try {
        const paymentData = JSON.parse(message.content.toString());
        console.log("Received payment success event:", paymentData);

        const { orderId, status } = paymentData;

        // Update order status
        if (orderId && status) {
          await orderService.updateOrderStatus(orderId, status);
          console.log(`Order ${orderId} status updated to ${status}`);
        }

        // Acknowledge the message
        channel.ack(message);
      } catch (error) {
        console.error("Error processing payment success event:", error);
        // Reject the message and requeue it
        channel.nack(message, false, true);
      }
    }
  });

  console.log("Payment success event consumer started");
};

module.exports = {
  connectRabbit,
  publishOrder,
  publishPaymentDetails,
  consumePaymentSuccessEvents
};