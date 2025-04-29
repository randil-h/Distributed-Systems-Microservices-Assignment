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

// ==============================================
// ROUTES WITH CORRECT PATH REWRITING
// ==============================================

// Auth Service routes - IMPORTANT: Notice the pathRewrite
app.use('/api/auth', createProxyMiddleware({
  target: serviceUrls.auth,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // Rewrite /api/auth/* to /api/auth/* (no change needed)
    return path;
  },
  onError: (err, req, res) => {
    console.error('Auth Proxy error:', err);
    res.status(500).json({ message: 'Auth Service unavailable' });
  }
}));

// User routes
app.use('/api/user', createProxyMiddleware({
  target: serviceUrls.auth,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('User Proxy error:', err);
    res.status(500).json({ message: 'User Service unavailable' });
  }
}));

// Restaurant admin routes
app.use('/api/restaurants', createProxyMiddleware({
  target: serviceUrls.restaurantAdmin,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('Restaurant Admin Proxy error:', err);
    res.status(500).json({ message: 'Restaurant Admin Service unavailable' });
  }
}));

app.use('/api/menu-items', createProxyMiddleware({
  target: serviceUrls.restaurantAdmin,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('Menu Items Proxy error:', err);
    res.status(500).json({ message: 'Menu Items Service unavailable' });
  }
}));

// Restaurant delivery routes
app.use('/api/delivery', createProxyMiddleware({
  target: serviceUrls.restaurantDelivery,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('Delivery Proxy error:', err);
    res.status(500).json({ message: 'Delivery Service unavailable' });
  }
}));

// Restaurant operations routes
app.use('/api/orders', createProxyMiddleware({
  target: serviceUrls.restaurantOps,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('Operations Proxy error:', err);
    res.status(500).json({ message: 'Operations Service unavailable' });
  }
}));

// Handle the path collision between restaurantOps and restaurantOrder
// This will require additional logic based on your specific API design
// You might need to differentiate based on the HTTP method or specific URL patterns

// Restaurant order routes - this might need to be refined based on your API structure
app.use('/api/order', createProxyMiddleware({  // Changed from /api/orders to /api/order to avoid collision
  target: serviceUrls.restaurantOrder,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // If you need to rewrite /api/order to /api/orders, uncomment the next line
    // return path.replace(/^\/api\/order/, '/api/orders');
    return path;
  },
  onError: (err, req, res) => {
    console.error('Order Proxy error:', err);
    res.status(500).json({ message: 'Order Service unavailable' });
  }
}));

// System admin routes
app.use('/api/stripe', createProxyMiddleware({
  target: serviceUrls.systemAdmin,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('System Admin Proxy error:', err);
    res.status(500).json({ message: 'System Admin Service unavailable' });
  }
}));

// Notifications routes
app.use('/api/notifications', createProxyMiddleware({
  target: serviceUrls.notification,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('Notifications Proxy error:', err);
    res.status(500).json({ message: 'Notifications Service unavailable' });
  }
}));

// Payment routes
app.use('/api/payments', createProxyMiddleware({
  target: serviceUrls.payment,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // No change needed
    return path;
  },
  onError: (err, req, res) => {
    console.error('Payment Proxy error:', err);
    res.status(500).json({ message: 'Payment Service unavailable' });
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Gateway is operational' });
});

// Check all service health endpoints
app.get('/services-health', async (req, res) => {
  const serviceHealth = {};

  try {
    for (const [serviceName, serviceUrl] of Object.entries(serviceUrls)) {
      try {
        await checkServiceAvailability(serviceUrl, '/health');
        serviceHealth[serviceName] = 'UP';
      } catch (error) {
        serviceHealth[serviceName] = 'DOWN';
      }
    }
    res.status(200).json({ status: 'OK', services: serviceHealth });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
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
  console.log('Service URLs:');
  for (const [service, url] of Object.entries(serviceUrls)) {
    console.log(`- ${service}: ${url}`);
  }

  // Check restaurant admin service
  try {
    await checkServiceAvailability(serviceUrls.restaurantAdmin, '/health');
    console.log('Restaurant admin service is reachable');
  } catch (error) {
    console.error('Restaurant admin service is NOT reachable:', error.message);
  }

  // Check auth service
  try {
    await checkServiceAvailability(serviceUrls.auth, '/health');
    console.log('Auth service is reachable');
  } catch (error) {
    console.error('Auth service is NOT reachable:', error.message);
  }
});
