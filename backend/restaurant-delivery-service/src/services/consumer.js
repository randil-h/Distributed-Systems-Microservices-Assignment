// services/consumer.js
const amqp = require("amqplib");
const Delivery = require("../models/Delivery");
const sendDriverAssignmentRequest = require("./publisher");

async function startDeliveryServiceConsumers() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Existing consumer for driver assignment response
    const responseQueue = "driver-assigned-response";
    await channel.assertQueue(responseQueue, { durable: true });

    channel.consume(responseQueue, async (msg) => {
        const data = JSON.parse(msg.content.toString());
        const { orderId, driver } = data;

        console.log("Received assigned driver:", driver);

        await Delivery.findOneAndUpdate(
            { orderId },
            {
                assignedDriver: driver,
                status: "Assigned"
            },
            { new: true }
        );

        channel.ack(msg);
    });

    // New consumer for orders coming from order service
    const orderQueue = "order_created_delivery"; // same name you used in publisher
    await channel.assertQueue(orderQueue, { durable: true });

    channel.consume(orderQueue, async (msg) => {
        const data = JSON.parse(msg.content.toString());
        const { orderId, deliveryLocation } = data;

        console.log("Received new delivery order:", data);

        try {
            const delivery = new Delivery({
                orderId,
                customerAddress: deliveryLocation
            });
            await delivery.save();

            // Optionally trigger driver assignment
            await sendDriverAssignmentRequest(orderId, deliveryLocation);

            console.log("Delivery created and driver assignment requested.");
        } catch (error) {
            console.error("Error processing delivery creation:", error);
        }

        channel.ack(msg);
    });

    console.log("Delivery Service: Listening to queues...");
}

module.exports = startDeliveryServiceConsumers;
