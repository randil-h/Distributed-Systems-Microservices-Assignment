require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const expressWinston = require('express-winston');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const http = require('http');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 8080;
const IS_LOCAL = process.env.NODE_ENV === 'local';

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

// Helper function to get service URLs based on environment
const getServiceUrls = () => {
  if (IS_LOCAL) {
    // Use localhost URLs when running locally
    return {
      auth: process.env.LOCAL_AUTH_SERVICE_URL || 'http://localhost:6969',
      restaurantAdmin: process.env.LOCAL_RESTAURANT_ADMIN_URL || 'http://localhost:5556',
      restaurantDelivery: process.env.LOCAL_RESTAURANT_DELIVERY_URL || 'http://localhost:5003',
      restaurantOps: process.env.LOCAL_RESTAURANT_OPS_URL || 'http://localhost:6966',
      restaurantOrder: process.env.LOCAL_RESTAURANT_ORDER_URL || 'http://localhost:6967',
      systemAdmin: process.env.LOCAL_SYSTEM_ADMIN_URL || 'http://localhost:5555',
      notification: process.env.LOCAL_NOTIFICATION_URL || 'http://localhost:5556',
      payment: process.env.LOCAL_PAYMENT_URL || 'http://localhost:2703'
    };
  } else {
    // Use Docker service names when running in Docker
    return {
      auth: process.env.UTILITY_AUTH_SERVICE_URL,
      restaurantAdmin: process.env.RESTAURANT_ADMIN_SERVICE_URL,
      restaurantDelivery: process.env.RESTAURANT_DELIVERY_SERVICE_URL,
      restaurantOps: process.env.RESTAURANT_OPS_SERVICE_URL,
      restaurantOrder: process.env.RESTAURANT_ORDER_SERVICE_URL,
      systemAdmin: process.env.SYSTEM_ADMIN_SERVICE_URL,
      notification: process.env.UTILITY_NOTIFICATION_SERVICE_URL,
      payment: process.env.UTILITY_PAYMENT_SERVICE_URL
    };
  }
};

const serviceUrls = getServiceUrls();

// Improved health check function that works with full URLs
const checkServiceAvailability = (serviceUrl, path) => {
  const parsedUrl = new URL(path, serviceUrl);

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname,
        method: 'GET',
        timeout: 3000
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          console.log(`Service check for ${serviceUrl}${path} returned ${res.statusCode}`);
          resolve({ status: res.statusCode, data });
        });
      }
    );
    req.on('error', (e) => {
      console.error(`Service check error for ${serviceUrl}${path}: ${e.message}`);
      reject(e);
    });
    req.end();
  });
};

// Public routes
app.use('/api/auth', createProxyMiddleware({
  target: serviceUrls.auth,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Protected routes
// Restaurant admin routes
app.use('/api/restaurants', createProxyMiddleware({
  target: serviceUrls.restaurantAdmin,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

app.use('/api/menu-items', createProxyMiddleware({
  target: serviceUrls.restaurantAdmin,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Restaurant delivery routes
app.use('/api/delivery', createProxyMiddleware({
  target: serviceUrls.restaurantDelivery,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Restaurant operations routes
app.use('/api/orders', createProxyMiddleware({
  target: serviceUrls.restaurantOps,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Restaurant order routes
app.use('/api/orders', createProxyMiddleware({
  target: serviceUrls.restaurantOrder,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// System admin routes
app.use('/api/stripe', createProxyMiddleware({
  target: serviceUrls.systemAdmin,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Notifications routes
app.use('/api/notifications', createProxyMiddleware({
  target: serviceUrls.notification,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Payment routes
app.use('/api/payments', createProxyMiddleware({
  target: serviceUrls.payment,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
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

app.listen(PORT, async () => {
  console.log(`API Gateway running on port ${PORT} in ${IS_LOCAL ? 'LOCAL' : 'DOCKER'} mode`);

  // Check restaurant admin service
  try {
    await checkServiceAvailability(serviceUrls.auth, '/health');
    await checkServiceAvailability(serviceUrls.restaurantAdmin, '/health');
    await checkServiceAvailability(serviceUrls.restaurantOps, '/health');
    await checkServiceAvailability(serviceUrls.restaurantOrder, '/health');
    await checkServiceAvailability(serviceUrls.restaurantDelivery, '/health');
    await checkServiceAvailability(serviceUrls.systemAdmin, '/health');
    await checkServiceAvailability(serviceUrls.notification, '/health');
    await checkServiceAvailability(serviceUrls.payment, '/health');


    console.log('Restaurant admin service is reachable');
  } catch (error) {
    console.error('Restaurant admin service is NOT reachable:', error.message);
  }
});
