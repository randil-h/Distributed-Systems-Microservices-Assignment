import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

const initStripe = () => {
    const stripeKey = process.env.REACT_APP_STRIPE_SANDBOX_FRONTEND_API_KEY;
    if (!stripeKey) {
        console.error("Stripe publishable key is not defined. Please check your environment variables.");
        return null;
    }
    try {
        return loadStripe(stripeKey);
    } catch (error) {
        console.error("Error initializing Stripe:", error);
        return null;
    }
};

const stripePromise = initStripe();

const CheckoutForm = ({ orderDetails }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        if (messageType === "success") {
            const timer = setTimeout(() => {
                navigate('/myorders')
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe or Elements not initialized");
            setMessage("Payment processing is not available. Please try again later.");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");
        setMessageType("");

        try {
            // Use the first order's details for payment (or you can modify to handle multiple)
            const firstOrder = orderDetails.orders[0];

            const { data } = await axios.post("http://localhost:2703/api/payments/create-payment-intent", {
                amount: orderDetails.amount * 100,
                currency: "lkr",
                userId: orderDetails.orders[0].userId,
                restaurantId: firstOrder.restaurantId,
                orderId: firstOrder._id
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setMessage(result.error.message);
                setMessageType("error");
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    setMessage("Payment Successful!");
                    setMessageType("success");

                    // Here you might want to update all orders' status to "paid"
                    // You can make an API call to your backend to confirm payment
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            setMessage("An unexpected error occurred. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount, currency) => {
        const formatted = (amount).toFixed(2);
        return `${currency.toUpperCase()} ${formatted}`;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Complete Your Payment
            </h2>

            <div className="text-center text-gray-600 mb-6 text-sm">
                You will be charged <span className="font-semibold">
                    {formatAmount(orderDetails.amount, "lkr")}
                </span> by <span className="font-semibold">NOMNOM PRIVATE LIMITED</span>. <br />
                Secure payment powered by Stripe.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="card-element"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Credit or Debit Card
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {loading ? "Processing..." : `Pay ${formatAmount(orderDetails.amount, "lkr")}`}
                </button>

                {message && (
                    <div className={`p-3 rounded-md text-sm 
                        ${messageType === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"}`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

const Payment = () => {
    const location = useLocation();
    const orderDetails = location.state;

    if (!stripePromise) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="text-red-600 text-center">
                    Unable to initialize payment. Please check your configuration.
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="text-red-600 text-center">
                    No order details found. Please start from the cart page.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto">
                <Elements stripe={stripePromise}>
                    <CheckoutForm orderDetails={orderDetails} />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;