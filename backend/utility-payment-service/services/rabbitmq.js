const amqp = require("amqplib");

let channel, connection;
const paymentSuccessQueue = "payment_success";

const connectRabbit = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
        channel = await connection.createChannel();

        // Assert queue for payment success events
        await channel.assertQueue(paymentSuccessQueue, { durable: true });

        console.log("Payment Service: Connected to RabbitMQ");
    } catch (err) {
        console.error("Payment Service: Failed to connect to RabbitMQ", err);
    }
};

const publishPaymentSuccess = async (paymentData) => {
    if (!channel) {
        await connectRabbit();
    }

    channel.sendToQueue(paymentSuccessQueue, Buffer.from(JSON.stringify(paymentData)), {
        persistent: true
    });

    console.log("Payment success event published to RabbitMQ:", paymentData);
};

// Initialize connection when the service starts
const initializeRabbitMQ = async () => {
    await connectRabbit();
};

module.exports = {
    connectRabbit,
    publishPaymentSuccess,
    initializeRabbitMQ
};