require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const expressWinston = require('express-winston');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logging middleware
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
}));

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Public routes
app.use('/api/auth', createProxyMiddleware({
  target: process.env.UTILITY_AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '',
  },
}));

// Restaurant admin routes
app.use('/api/admin', authenticate, createProxyMiddleware({
  target: process.env.RESTAURANT_ADMIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/admin': '',
  },
}));

// Restaurant delivery routes
app.use('/api/delivery', authenticate, createProxyMiddleware({
  target: process.env.RESTAURANT_DELIVERY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/delivery': '',
  },
}));

// Restaurant operations routes
app.use('/api/ops', authenticate, createProxyMiddleware({
  target: process.env.RESTAURANT_OPS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/ops': '',
  },
}));

// Restaurant order routes
app.use('/api/orders', authenticate, createProxyMiddleware({
  target: process.env.RESTAURANT_ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '',
  },
}));

// System admin routes
app.use('/api/system', authenticate, createProxyMiddleware({
  target: process.env.SYSTEM_ADMIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/system': '',
  },
}));

// Notifications routes
app.use('/api/notifications', authenticate, createProxyMiddleware({
  target: process.env.UTILITY_NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '',
  },
}));

// Payment routes
app.use('/api/payments', authenticate, createProxyMiddleware({
  target: process.env.UTILITY_PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/payments': '',
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Gateway is operational' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
