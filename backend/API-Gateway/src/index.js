require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const expressWinston = require('express-winston');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8080;

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

const checkServiceAvailability = (host, port, path) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host, port, path, method: 'GET', timeout: 3000 },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          console.log(`Service check for ${host}:${port}${path} returned ${res.statusCode}`);
          resolve({ status: res.statusCode, data });
        });
      }
    );
    req.on('error', (e) => {
      console.error(`Service check error for ${host}:${port}${path}: ${e.message}`);
      reject(e);
    });
    req.end();
  });
};

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
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Protected routes
// Restaurant admin routes
// Update your API Gateway code with this
app.use('/api/restaurants', createProxyMiddleware({
  target: process.env.RESTAURANT_ADMIN_SERVICE_URL,
  changeOrigin: true,
  // No pathRewrite needed since the paths align
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

app.use('/api/menu-items', createProxyMiddleware({
  target: process.env.RESTAURANT_ADMIN_SERVICE_URL,
  changeOrigin: true,
  // No pathRewrite needed since the paths align
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Restaurant delivery routes
app.use('/api/delivery', authenticate, createProxyMiddleware({
  target: process.env.RESTAURANT_DELIVERY_SERVICE_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Restaurant operations routes
app.use('/api/ops', createProxyMiddleware({
  target: process.env.RESTAURANT_OPS_SERVICE_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Restaurant order routes
app.use('/api/orders',  createProxyMiddleware({
  target: process.env.RESTAURANT_ORDER_SERVICE_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// System admin routes
app.use('/api/system', createProxyMiddleware({
  target: process.env.SYSTEM_ADMIN_SERVICE_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Notifications routes
app.use('/api/notifications', authenticate, createProxyMiddleware({
  target: process.env.UTILITY_NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Service unavailable' });
  }
}));

// Payment routes
app.use('/api/payments', authenticate, createProxyMiddleware({
  target: process.env.UTILITY_PAYMENT_SERVICE_URL,
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
  console.log(`API Gateway running on port ${PORT}`);

  // Check restaurant admin service
  try {
    await checkServiceAvailability('restaurant-admin-service', 5556, '/health');
    console.log('Restaurant admin service is reachable');
  } catch (error) {
    console.error('Restaurant admin service is NOT reachable');
  }
});

// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}`);
// });
