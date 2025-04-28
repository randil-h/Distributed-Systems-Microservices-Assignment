const amqp = require("amqplib");
const sendEmail = require("../sendEmail");
const sendSMS = require("../sendSMS");

require('dotenv').config(); // Load environment variables

async function listenForNotifications() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notificationQueue = "send-driver-notification";

    await channel.assertQueue(notificationQueue, { durable: true });

    channel.consume(notificationQueue, async (msg) => {
        const { toEmail, toPhone, subject, text } = JSON.parse(msg.content.toString());
        console.log("Received notification task:", { toEmail, toPhone, subject, text });

        await sendEmail(toEmail, subject, text);
        await sendSMS(toPhone, text);

        channel.ack(msg);
    });
}

listenForNotifications().catch(console.error);
