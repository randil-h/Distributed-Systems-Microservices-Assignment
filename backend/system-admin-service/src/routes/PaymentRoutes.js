const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.get('/', PaymentController.getPayments);

router.get('/:id', PaymentController.getPaymentById);

module.exports = router;