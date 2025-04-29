const Stripe = require("stripe");
const Payment = require("../models/Payment");
const { publishPaymentSuccess } = require("../services/rabbitmq");
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

        // If payment is successful, publish event to update order status
        if (status === "succeeded") {
            await publishPaymentSuccess({
                orderId,
                paymentId: payment._id,
                status: "confirmed", // The status you want to update the order to
                timestamp: new Date()
            });
            console.log("Payment success event published for order:", orderId);
        }
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

// Handle Stripe webhook for payment confirmation
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle successful payment confirmation
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const { userId, restaurantId, orderId } = paymentIntent.metadata;

            // Parse order IDs if needed
            const orderIds = orderId.includes(',') ? orderId.split(',') : [orderId];

            // Update payment status and publish event for each order
            for (const oid of orderIds) {
                await savePayment({
                    paymentIntentId: paymentIntent.id,
                    amount: Math.floor(paymentIntent.amount / orderIds.length),
                    userId,
                    restaurantId,
                    orderId: oid,
                    status: "succeeded"
                });
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = {
    createPaymentIntent,
    savePayment,
    handleStripeWebhook
};