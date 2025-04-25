const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const listenForAssignmentRequests = require("./services/consumer");

// Initialize configuration
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'TOKEN_EXPIRY'];
requiredEnvVars.forEach(env => {
    if (!process.env[env]) {
        console.error(`ERROR: Missing required environment variable ${env}`);
        process.exit(1);
    }
});

// Database connection
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

// Rate limiting for auth routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later"
});

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'Authentication Service'
    });
});

app.use("/api/auth", limiter, authRoutes);
app.use("/api/user", userRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

const PORT = process.env.PORT||6969;
app.listen(PORT, () => console.log(`Authentication Service running on port ${PORT}`));
listenForAssignmentRequests();
