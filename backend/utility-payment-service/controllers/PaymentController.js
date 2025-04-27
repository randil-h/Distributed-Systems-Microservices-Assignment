const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SANDBOX_BACKEND_API_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, userID, restaurantID, orderID } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
            payment_method_types: ["card"],
            metadata: {
                userID,
                restaurantID,
                orderID,
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createPaymentIntent };