// services/publisher.js
const amqp = require("amqplib");

async function sendDriverAssignmentRequest(orderId, customerAddress) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const requestQueue = "assign-driver-request";

    await channel.assertQueue(requestQueue, { durable: true });

    const message = { orderId, customerAddress };
    channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify(message)));

    console.log("Sent assign-driver request to queue");
}
module.exports = sendDriverAssignmentRequest;
