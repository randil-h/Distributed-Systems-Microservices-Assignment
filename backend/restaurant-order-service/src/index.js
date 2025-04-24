const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectRabbit } = require("./services/rabbitmq");

const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
connectRabbit(); // Initiates RabbitMQ connection when service starts
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 6967;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://restaurantadmin:l6bXfcMuv7vng50T@cluster0.sa2mz.mongodb.net/OrderDB?retryWrites=true&w=majority&appName=Cluster0', {
  })
  .then(() => {
    console.log("MongoDB connected.");
    app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
