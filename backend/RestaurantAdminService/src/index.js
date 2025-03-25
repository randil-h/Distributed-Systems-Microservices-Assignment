const mongoose = require('mongoose');
const express = require('express');
const restaurantAdminRoutes = require('../src/routes/restaurantAdminRoutes');
require('dotenv').config();

const MONGODB_URI = "mongodb+srv://restaurantadmin:l6bXfcMuv7vng50T@cluster0.sa2mz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Hardcoded URI

console.log("MongoDB URI:", MONGODB_URI); // Debugging line

const app = express();
app.use(express.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/restaurants', restaurantAdminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));