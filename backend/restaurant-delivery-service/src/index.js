require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const deliveryRoutes = require("./routes/deliveryRoutes");
const listenForDriverAssignment = require("./services/consumer");

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(5003, () => console.log("Delivery Service running on port 5003"));
    listenForDriverAssignment();
});

app.use("/api/delivery", deliveryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'restaurant-delivery-service' });
});
