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

        const drivers = await User.find({ role: "delivery-personnel" });
        console.log(drivers);

        let nearestDriver = null;
        let minDistance = Infinity;

        const toRadians = (degree) => (degree * Math.PI) / 180;

        // Haversine Formula
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of Earth in KM
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in KM
        };

        // Find nearest driver
        for (const driver of drivers) {
            if (!driver.location || !driver.location.lat || !driver.location.lng) continue;

            const distance = calculateDistance(
                customerAddress.lat, customerAddress.lng,
                driver.location.lat, driver.location.lng
            );
            console.log(distance);

            if (distance < 5 && distance < minDistance) { // 5km radius
                nearestDriver = driver;
                minDistance = distance;
            }
        }

        if (nearestDriver) { // Corrected this from `driver` to `nearestDriver`
            const response = {
                orderId,
                driver: {
                    driverId: nearestDriver._id, // Use nearestDriver here
                    name: nearestDriver.name, // Use nearestDriver here
                    location: nearestDriver.location || "Unknown", // Use nearestDriver here\\
                    phone: nearestDriver.mobile,
                },
            };

            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response)));
            console.log("Sent assigned driver back to delivery service", response);

            const notificationQueue = "send-driver-notification";
            channel.sendToQueue(notificationQueue, Buffer.from(JSON.stringify(response)));
            console.log("Sent assigned driver notification to notification service", response);

        } else {
            console.warn("No available driver for location:", customerAddress);
        }

        channel.ack(msg);
    });
}

module.exports = listenForAssignmentRequests;
