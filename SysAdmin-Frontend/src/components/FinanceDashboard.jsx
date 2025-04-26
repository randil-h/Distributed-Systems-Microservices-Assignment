import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShimmerRow = () => (
    <tr className="animate-pulse">
        <td className="py-3 px-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </td>
        <td className="py-3 px-4">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </td>
        <td className="py-3 px-4">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </td>
        <td className="py-3 px-4">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </td>
    </tr>
);

const FinanceDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:5555/stripe');
                setPayments(response.data.data);
            } catch (err) {
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center">Admin Financial Dashboard</h2>
                <div className="overflow-x-auto rounded-xl shadow-md">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead>
                        <tr className="text-left text-sm uppercase text-gray-400 bg-gray-700">
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Currency</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <>
                                <ShimmerRow />
                                <ShimmerRow />
                                <ShimmerRow />
                                <ShimmerRow />
                            </>
                        ) : payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <tr
                                    key={payment.id}
                                    className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                                >
                                    <td className="py-3 px-4 truncate max-w-[200px]">{payment.id}</td>
                                    <td className="py-3 px-4">${(payment.amount / 100).toFixed(2)}</td>
                                    <td className="py-3 px-4">{payment.currency.toUpperCase()}</td>
                                    <td className="py-3 px-4 capitalize">{payment.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-400">
                                    No payments found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;