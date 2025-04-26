const amqp = require("amqplib");

let channel, connection;
const queueName = "order_created";

const connectRabbit = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ", err);
  }
};

const publishOrder = async (order) => {
  if (!channel) {
    await connectRabbit();
  }
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(order)), {
    persistent: true
  });
  console.log("Order published to RabbitMQ:", order);
};

module.exports = {
  connectRabbit,
  publishOrder
};
