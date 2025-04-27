const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes for each service
app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/admin', createProxyMiddleware({
  target: process.env.ADMIN_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/ops', createProxyMiddleware({
  target: process.env.OPS_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/delivery', createProxyMiddleware({
  target: process.env.DELIVERY_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/system', createProxyMiddleware({
  target: process.env.SYSTEM_ADMIN_URL,
  changeOrigin: true
}));

app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/notifications', createProxyMiddleware({
  target: process.env.NOTIFICATIONS_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/payments', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true
}));

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('Gateway OK');
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
