const amqp = require("amqplib");
const mongoose = require("mongoose");
const User = require("../models/User");

async function listenForAssignmentRequests() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();

    const requestQueue = "assign-driver-request";
    const responseQueue = "driver-assigned-response";

    await channel.assertQueue(requestQueue, { durable: true });
    await channel.assertQueue(responseQueue, { durable: true });

    channel.consume(requestQueue, async (msg) => {
        const { orderId, customerAddress } = JSON.parse(msg.content.toString());
        console.log("Assigning driver for order:", orderId);

        // Find a driver based on customer location
        const driver = await User.findOne({
            role: "delivery-personnel",
            location: customerAddress,
        });

        if (driver) {
            const response = {
                orderId,
                driver: {
                    driverId: driver._id,
                    name: driver.name,
                    location: driver.location || "Unknown",
                },
            };

            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response)));
            console.log("Sent assigned driver back to delivery service", response);
        } else {
            console.warn("No available driver for location:", customerAddress);
        }

        channel.ack(msg);
    });
}

module.exports = listenForAssignmentRequests;
