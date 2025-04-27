import React, { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
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

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [paymentDetails, setPaymentDetails] = useState({
        amount: 100000,  // Default value (in cents/minor units)
        currency: "lkr", // Default value
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Additional stripe check
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
            const { data } = await axios.post("http://localhost:2703/create-payment-intent", {
                amount: paymentDetails.amount,
                currency: paymentDetails.currency,
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
        // Stripe usually uses "cents", so divide by 100
        const formatted = (amount / 100).toFixed(2);
        return `${currency.toUpperCase()} ${formatted}`;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Complete Your Payment
            </h2>
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
                    {loading ? "Processing..." : `Pay ${formatAmount(paymentDetails.amount, paymentDetails.currency)}`}
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
    if (!stripePromise) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="text-red-600 text-center">
                    Unable to initialize payment. Please check your configuration.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto">
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;