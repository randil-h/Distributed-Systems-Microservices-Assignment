const Stripe = require("stripe");
const Payment = require("../models/Payment");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SANDBOX_BACKEND_API_KEY);

const savePayment = async ({ paymentIntentId, amount, userId, restaurantId, orderId, status = "succeeded" }) => {
    try {
        const payment = new Payment({
            paymentIntent: paymentIntentId,
            orderId,
            userId,
            restaurantId,
            value: amount,
            status,
        });

        await payment.save();
        console.log("Payment saved successfully.");
    } catch (error) {
        console.error("Error saving payment:", error);
        throw error;
    }
};

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, userId, restaurantId, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ["card"],
            metadata: {
                userId,
                restaurantId,
                orderId: Array.isArray(orderId) ? orderId.join(',') : orderId,
            },
        });


        const orderIds = Array.isArray(orderId) ? orderId : [orderId];

        await Promise.all(orderIds.map(async (oid) => {
            await savePayment({
                paymentIntentId: paymentIntent.id,
                amount: Math.floor(amount / orderIds.length),
                userId,
                restaurantId,
                orderId: oid,
                status: "succeeded"
            });
        }));

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPaymentIntent, savePayment };