const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const {authenticate, authorizeRole} = require('../middleware/AuthMiddleware');

router.get('/', authenticate, authorizeRole('system-admin'), PaymentController.getPayments);

router.get('/:id', authenticate, authorizeRole('system-admin'), PaymentController.getPaymentById);

module.exports = router;