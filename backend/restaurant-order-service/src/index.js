// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectRabbit } = require("./services/rabbitmq");

// Import routes
const orderRoutes = require("./routes/orderRoutes");

// Load environment variables
dotenv.config();

// Initialize RabbitMQ connection
connectRabbit();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);

// Define port
const PORT = process.env.PORT || 6967;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://restaurantadmin:l6bXfcMuv7vng50T@cluster0.sa2mz.mongodb.net/OrderDB?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
