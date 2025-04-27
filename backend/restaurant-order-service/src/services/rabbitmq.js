const amqp = require("amqplib");

let channel, connection;
const queueName = "order_created";
const queueNameForPaymentService = "order_created_payment";
const queueNameForDeliveryService = "order_created_delivery";
const paymentDetailsQueue = "order_payment_details";

const connectRabbit = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();

    // Assert all queues
    await channel.assertQueue(queueName, { durable: true });
    await channel.assertQueue(queueNameForPaymentService, { durable: true });
    await channel.assertQueue(queueNameForDeliveryService, { durable: true });
    await channel.assertQueue(paymentDetailsQueue, { durable: true });

    console.log("Order Service: Connected to RabbitMQ");
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

module.exports = {
  connectRabbit,
  publishOrder,
  publishPaymentDetails
};