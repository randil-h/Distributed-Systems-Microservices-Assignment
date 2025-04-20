const mongoose = require('mongoose');
const express = require('express');
const restaurantAdminRoutes = require('../src/routes/restaurantAdminRoutes');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const menuItemRoutes = require('../src/routes/menuItemRoutes');
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'PORT'];
requiredEnvVars.forEach(env => {
    if (!process.env[env]) {
        console.error(`ERROR: Missing required environment variable ${env}`);
        process.exit(1);
    }
});

const app = express();
app.use(cors()); // Add this line
app.use(express.json());

// MongoDB connection with improved configuration
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'RestaurantDB' // Specify the database name here
})
    .then(() => console.log('MongoDB Connected Successfully (Restaurant Admin Service)'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/restaurants', restaurantAdminRoutes);
app.use('/api/menu-items', menuItemRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using MongoDB: ${process.env.MONGODB_URI.split('@')[1]}`); // Logs the cluster info without credentials
});

// Handle process termination
process.on('SIGTERM', () => {
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('Server and MongoDB connection closed');
            process.exit(0);
        });
    });
});