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
        <td className="py-3 px-4">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </td>
    </tr>
);

const FinanceDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState('all');
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [restaurantDetails, setRestaurantDetails] = useState({});

    // Fetch all payments
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:9999/payments');
                setPayments(response.data.data);
                setFilteredPayments(response.data.data);

                // Extract unique restaurant IDs
                const restaurantIds = [...new Set(response.data.data.map(payment =>
                    payment.restaurantId ? payment.restaurantId : null
                ))].filter(id => id !== null);

                setRestaurants(restaurantIds);

                // Fetch restaurant details for each unique restaurant
                restaurantIds.forEach(fetchRestaurantDetails);
            } catch (err) {
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Fetch restaurant details by ID
    const fetchRestaurantDetails = async (restaurantId) => {
        try {
            const response = await axios.get(`http://localhost:5556/api/restaurants/${restaurantId}`);
            setRestaurantDetails(prevDetails => ({
                ...prevDetails,
                [restaurantId]: response.data
            }));
        } catch (err) {
            console.error(`Error fetching restaurant details for ID ${restaurantId}:`, err);
        }
    };

    // Filter payments when restaurant selection changes
    useEffect(() => {
        if (selectedRestaurant === 'all') {
            setFilteredPayments(payments);
        } else {
            const filtered = payments.filter(payment =>
                payment.restaurantId === selectedRestaurant
            );
            setFilteredPayments(filtered);
        }
    }, [selectedRestaurant, payments]);

    // Handle restaurant selection change
    const handleRestaurantChange = (e) => {
        setSelectedRestaurant(e.target.value);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount / 100);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Format MongoDB ID to shorter version
    const formatId = (id) => {
        if (!id) return 'N/A';
        return typeof id === 'object' && id.$oid ? id.$oid.substring(0, 8) + '...' :
            typeof id === 'string' ? id.substring(0, 8) + '...' : 'N/A';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center">Admin Financial Dashboard</h2>

                {/* Restaurant Filter */}
                <div className="mb-6">
                    <label htmlFor="restaurant-filter" className="block text-sm font-medium text-gray-400 mb-2">
                        Filter by Restaurant:
                    </label>
                    <select
                        id="restaurant-filter"
                        value={selectedRestaurant}
                        onChange={handleRestaurantChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 w-full max-w-xs"
                    >
                        <option value="all">All Restaurants</option>
                        {restaurants.map(id => (
                            <option key={id} value={id}>
                                {restaurantDetails[id]?.name || `Restaurant ID: ${formatId(id)}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Restaurant Details Card (when filtered) */}
                {selectedRestaurant !== 'all' && restaurantDetails[selectedRestaurant] && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                        <h3 className="text-xl font-semibold mb-2">{restaurantDetails[selectedRestaurant].name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Legal Name:</p>
                                <p className="text-white">{restaurantDetails[selectedRestaurant].legalBusinessName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Cuisine:</p>
                                <p className="text-white">{restaurantDetails[selectedRestaurant].cuisineType}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Contact:</p>
                                <p className="text-white">{restaurantDetails[selectedRestaurant].phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Email:</p>
                                <p className="text-white">{restaurantDetails[selectedRestaurant].email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Status:</p>
                                <p className="text-white capitalize">{restaurantDetails[selectedRestaurant].registrationStatus}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Owner:</p>
                                <p className="text-white">{restaurantDetails[selectedRestaurant].ownerName}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-medium mb-2">Total Transactions</h3>
                        <p className="text-2xl font-bold">{filteredPayments.length}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
                        <p className="text-2xl font-bold">
                            {formatCurrency(filteredPayments.reduce((sum, payment) =>
                                sum + (payment.value || 0), 0))}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-medium mb-2">Successful Payments</h3>
                        <p className="text-2xl font-bold">
                            {filteredPayments.filter(p => p.status === 'succeeded').length}
                        </p>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="overflow-x-auto rounded-xl shadow-md">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead>
                        <tr className="text-left text-sm uppercase text-gray-400 bg-gray-700">
                            <th className="py-3 px-4">Payment ID</th>
                            <th className="py-3 px-4">Restaurant</th>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Date</th>
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
                        ) : filteredPayments.length > 0 ? (
                            filteredPayments.map((payment, index) => (
                                <tr
                                    key={payment._id?.$oid || payment._id}
                                    className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                                >
                                    <td className="py-3 px-4 truncate max-w-[150px]">
                                        {payment.paymentIntent || formatId(payment._id)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {restaurantDetails[payment.restaurantId]?.name ||
                                            `ID: ${formatId(payment.restaurantId)}`}
                                    </td>
                                    <td className="py-3 px-4">
                                        {formatId(payment.orderId)}
                                    </td>
                                    <td className="py-3 px-4">{formatCurrency(payment.value)}</td>
                                    <td className="py-3 px-4">
                                        {payment.createdAt ?
                                            formatDate(payment.createdAt.$date || payment.createdAt) :
                                            'N/A'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${payment.status === 'succeeded' ? 'bg-green-900 text-green-200' :
                                            payment.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                                                'bg-red-900 text-red-200'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-400">
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