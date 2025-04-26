import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/animations.css';

const TotalTransactionsWidget = () => {
    const [totalAmount, setTotalAmount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:5555/stripe');
                const total = response.data.data.reduce((sum, payment) => sum + payment.amount, 0);
                setTotalAmount(total);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="w-full sm:w-64 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-white border border-white/10">
            <div className="flex flex-col justify-center items-center h-full">
                <span className="text-sm uppercase text-gray-400 tracking-wide">Total Revenue</span>
                {loading ? (
                    <span className="text-3xl font-bold mt-2 relative overflow-hidden">
                        <span className="invisible">$0.00</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></span>
                    </span>
                ) : (
                    <span className="text-3xl font-bold mt-2">${(totalAmount / 100).toFixed(2)}</span>
                )}
            </div>
        </div>
    );
};

export default TotalTransactionsWidget;
