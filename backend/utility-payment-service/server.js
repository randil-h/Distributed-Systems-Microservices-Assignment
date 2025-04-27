const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SANDBOX_BACKEND_API_KEY);

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents (e.g., $10 = 1000)
            currency,
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/process-order-payment/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { currency = "lkr" } = req.body;

        console.log(`Received payment request for Order ID: ${orderId} with currency: ${currency}`);

        const amount = await getOrderPriceById(orderId);
        console.log(`Fetched order amount for Order ID ${orderId}: ${amount}`);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ["card"],
            metadata: {
                orderId
            }
        });
        console.log(`Created Stripe PaymentIntent with ID: ${paymentIntent.id} and status: ${paymentIntent.status}`);

        await publishPaymentRequest({
            orderId,
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: paymentIntent.status,
            timestamp: new Date()
        });
        console.log(`Published payment request for Order ID ${orderId} with PaymentIntent ID ${paymentIntent.id}`);

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount,
            orderId
        });
        console.log(`Sent client secret for Order ID ${orderId} to client`);
    } catch (error) {
        console.error(`Error processing payment for Order ID ${req.params.orderId}:`, error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 2703;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'utility-payment-service' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
