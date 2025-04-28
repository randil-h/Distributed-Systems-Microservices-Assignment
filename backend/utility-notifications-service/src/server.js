import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const app = express();
import cors from "cors";
import {listenForNotifications} from "./services/consumer.js";
app.use(cors());
const PORT = process.env.PORT || 5554;

// Middleware
app.use(express.json());

let channel, connection;
const notificationQueue = "send-driver-notification";

// Start Express server
app.get('/', (req, res) => {
    res.send('Notification Service is running 🚀');
});

// Start both RabbitMQ consumer and HTTP server
app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
    listenForNotifications(); // Start consuming RabbitMQ messages after server starts
});

// Handle process termination gracefully
process.on('SIGINT', async () => {
    console.log("Closing Notification Service...");
    if (channel) await channel.close();
    if (connection) await connection.close();
    process.exit(0);
});
