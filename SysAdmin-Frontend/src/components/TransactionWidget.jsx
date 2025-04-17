import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalTransactionsWidget = () => {
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:3270/stripe');
                console.log(response);
                const total = response.data.data.reduce((sum, payment) => sum + payment.amount, 0);
                setTotalAmount(total);
            } catch (err) {
                console.error('Error fetching payments:', err);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="w-full sm:w-64 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-white border border-white/10">
            <div className="flex flex-col justify-center items-center h-full">
                <span className="text-sm uppercase text-gray-400 tracking-wide">Total Revenue</span>
                <span className="text-3xl font-bold mt-2">${(totalAmount / 100).toFixed(2)}</span>
            </div>
        </div>
    );
};

export default TotalTransactionsWidget;
