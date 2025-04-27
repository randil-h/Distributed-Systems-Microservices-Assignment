// services/consumer.js
const amqp = require("amqplib");
const Delivery = require("../models/Delivery");

async function listenForDriverAssignment() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const responseQueue = "driver-assigned-response";
    await channel.assertQueue(responseQueue, { durable: true });

    channel.consume(responseQueue, async (msg) => {
        const data = JSON.parse(msg.content.toString());
        const { orderId, driver } = data;

        console.log("Received assigned driver:", driver);

        // Update delivery with assigned driver
        await Delivery.findOneAndUpdate(
            { orderId },
            {
                assignedDriver: driver,
                status: "assigned"
            },
            { new: true }
        );

        channel.ack(msg);
    });
}
module.exports = listenForDriverAssignment;
