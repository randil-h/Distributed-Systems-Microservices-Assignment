const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const orderService = require('./services/orderService');  // Import the service to start RabbitMQ consumer
const cors = require('cors');  // Optional: to enable cross-origin requests
const dotenv = require("dotenv");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization']
}));  // Optional: if you want to enable CORS

dotenv.config();

// Routes
app.use('/api/orders', orderRoutes);

// MongoDB connection
mongoose
.connect(process.env.MONGO_URI || 'mongodb+srv://restaurantadmin:l6bXfcMuv7vng50T@cluster0.sa2mz.mongodb.net/OrderDB?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Start RabbitMQ consumer
//orderService.startRabbitMQConsumer();  // Start the RabbitMQ consumer from the service

// Start the server
const PORT = process.env.PORT || 6966;
app.listen(PORT, () => {
  console.log(`Restaurant Operations Service is running on port ${PORT}`);
});
