import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, CreditCard, CheckCircle } from 'lucide-react';

const FinanceDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState({
        totalAmount: 0,
        avgAmount: 0,
        count: 0,
        recentDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3270/stripe');

                // Check if response.data is the array or if it has a data property
                const paymentData = Array.isArray(response.data) ? response.data :
                    (response.data && response.data.data ? response.data.data : []);

                setPayments(paymentData);
                calculateSummary(paymentData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError('Failed to fetch payment data');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const calculateSummary = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            setSummary({
                totalAmount: 0,
                avgAmount: 0,
                count: 0,
                recentDate: 'N/A'
            });
            return;
        }

        const total = data.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        const avg = total / data.length;

        // Find most recent date
        const timestamps = data.map(payment => payment.created).filter(Boolean);
        const latestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : null;
        const latestDate = latestTimestamp ?
            new Date(latestTimestamp * 1000).toLocaleDateString() : 'N/A';

        setSummary({
            totalAmount: total,
            avgAmount: avg,
            count: data.length,
            recentDate: latestDate
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount / 100);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    // Group transactions by date for the chart
    const prepareChartData = () => {
        if (!Array.isArray(payments) || payments.length === 0) return [];

        // Group payments by date
        const groupedByDate = payments.reduce((acc, payment) => {
            if (!payment.created) return acc;

            const date = formatDate(payment.created);

            if (!acc[date]) {
                acc[date] = {
                    totalAmount: 0,
                    count: 0
                };
            }

            acc[date].totalAmount += (payment.amount || 0);
            acc[date].count += 1;

            return acc;
        }, {});

        // Convert to array format for the chart
        return Object.keys(groupedByDate).map(date => ({
            date: date,
            amount: groupedByDate[date].totalAmount / 100, // Convert cents to dollars
            count: groupedByDate[date].count
        }));
    };

    const chartData = prepareChartData();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
                <div className="text-xl">Loading payment data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
                <div className="text-xl text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-8 text-center">Financial Dashboard</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
                        <div className="flex items-center mb-2">
                            <DollarSign className="text-emerald-400 mr-2" size={20} />
                            <span className="text-gray-400 text-sm">Total Volume</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
                        <div className="flex items-center mb-2">
                            <CheckCircle className="text-blue-400 mr-2" size={20} />
                            <span className="text-gray-400 text-sm">Transactions</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.count}</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
                        <div className="flex items-center mb-2">
                            <CreditCard className="text-purple-400 mr-2" size={20} />
                            <span className="text-gray-400 text-sm">Average Amount</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(summary.avgAmount)}</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
                        <div className="flex items-center mb-2">
                            <Calendar className="text-amber-400 mr-2" size={20} />
                            <span className="text-gray-400 text-sm">Latest Transaction</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.recentDate}</p>
                    </div>
                </div>

                {/* Chart Section */}
                {chartData.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Daily Transaction Volume</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#9CA3AF' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9CA3AF' }}
                                        label={{
                                            value: 'Amount (USD)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fill: '#9CA3AF' }
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                                        formatter={(value, name) => {
                                            if (name === 'amount') return [`$${value.toFixed(2)}`, 'Total Amount'];
                                            if (name === 'count') return [value, 'Transactions'];
                                            return [value, name];
                                        }}
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Bar dataKey="amount" name="Amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="count" name="Count" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center mt-4 text-sm text-gray-400">
                            <div className="flex items-center mr-6">
                                <div className="h-3 w-3 bg-green-500 rounded mr-2"></div>
                                <span>Daily Volume ($)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="h-3 w-3 bg-blue-500 rounded mr-2"></div>
                                <span>Transaction Count</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <h3 className="text-xl font-semibold p-6 border-b border-gray-700">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="text-left text-sm uppercase text-gray-400 bg-gray-700">
                                <th className="py-3 px-6">Transaction ID</th>
                                <th className="py-3 px-6">Amount</th>
                                <th className="py-3 px-6">Date</th>
                                <th className="py-3 px-6">Status</th>
                                <th className="py-3 px-6">Payment Method</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                            {Array.isArray(payments) && payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-700 transition-colors">
                                    <td className="py-4 px-6 truncate max-w-xs">
                                        <span className="font-mono text-sm">{payment.id}</span>
                                    </td>
                                    <td className="py-4 px-6 font-medium">{formatCurrency(payment.amount)}</td>
                                    <td className="py-4 px-6">{formatDate(payment.created)}</td>
                                    <td className="py-4 px-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {payment.payment_method_types && payment.payment_method_types[0].charAt(0).toUpperCase() + payment.payment_method_types[0].slice(1)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-400">
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;