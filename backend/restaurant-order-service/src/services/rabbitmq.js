// services/rabbitmq.js
const amqp = require("amqplib");

let channel, connection;
const queueName = "order_created";
const queueNameForPaymentService = "order_created_payment";
const queueNameForDeliveryService = "order_created_delivery";

const connectRabbit = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();

    // Assert all three queues
    await channel.assertQueue(queueName, { durable: true });
    await channel.assertQueue(queueNameForPaymentService, { durable: true });
    await channel.assertQueue(queueNameForDeliveryService, { durable: true });

    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ", err);
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

module.exports = {
  connectRabbit,
  publishOrder
};
