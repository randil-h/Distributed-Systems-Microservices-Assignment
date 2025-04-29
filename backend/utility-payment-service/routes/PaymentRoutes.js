const express = require("express");
const { createPaymentIntent , handleStripeWebhook } = require("../controllers/paymentController");
const {authenticate, authorizeRole} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-payment-intent", authenticate, createPaymentIntent);

router.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;