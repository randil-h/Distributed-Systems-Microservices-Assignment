import amqp from 'amqplib';
import sendSMS from "../sendSMS.js";


export async function listenForNotifications() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();

    const notificationQueue = "send-driver-notification";

    await channel.assertQueue(notificationQueue, { durable: true });

    channel.consume(notificationQueue, async (msg) => {
        const { orderId, driver } = JSON.parse(msg.content.toString());
        console.log("Received notification task:", { orderId, driver });

        const { phone, name } = driver;
        const text = `Hello ${name}, you have been assigned to deliver order #${orderId}.`;

        try {
            await sendSMS(phone, text);
            console.log(`Successfully sent SMS to ${name} (${phone}) for order #${orderId}`);
            channel.ack(msg);
        } catch (error) {
            console.error(` Failed to send SMS to ${name} (${phone}) for order #${orderId}`, error);
            // Important: do not ack the message if you want to retry later or send to dead-letter queue
        }
    });


}

listenForNotifications().catch(console.error);
