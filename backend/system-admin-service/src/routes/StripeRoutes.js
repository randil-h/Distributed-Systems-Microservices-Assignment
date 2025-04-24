const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
    try {
        const payments = await stripe.paymentIntents.list({ limit: 10 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;