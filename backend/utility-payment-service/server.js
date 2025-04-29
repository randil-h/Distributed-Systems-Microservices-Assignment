const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");
const { initializeRabbitMQ } = require("./services/rabbitmq");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({
    // Configure for Stripe webhook
    verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/api/payments/webhook')) {
            req.rawBody = buf.toString();
        }
    }
}));

// Connect to database
connectDB();

// Initialize RabbitMQ connection
initializeRabbitMQ().catch(err => {
    console.error("Failed to connect to RabbitMQ:", err);
    process.exit(1);
});

// Routes
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'utility-payment-service' });
});

// Start server
const PORT = process.env.PORT || 2703;
app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
});