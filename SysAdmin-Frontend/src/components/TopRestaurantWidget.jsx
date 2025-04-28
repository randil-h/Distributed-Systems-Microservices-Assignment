import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/animations.css';

const TopEarningRestaurantWidget = () => {
    const [topRestaurant, setTopRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRestaurant = async () => {
            try {
                // Fetch all payments
                const paymentsResponse = await axios.get('http://localhost:9999/payments');
                const payments = paymentsResponse.data.data;

                // Group payments by restaurant and calculate total earnings
                const restaurantEarnings = payments.reduce((acc, payment) => {
                    const restaurantId = payment.restaurantId?.$oid || payment.restaurantId;
                    if (!restaurantId) return acc;

                    if (!acc[restaurantId]) {
                        acc[restaurantId] = {
                            id: restaurantId,
                            totalEarnings: 0,
                            successfulTransactions: 0
                        };
                    }

                    // Only count succeeded payments
                    if (payment.status === 'succeeded') {
                        acc[restaurantId].totalEarnings += payment.value || 0;
                        acc[restaurantId].successfulTransactions += 1;
                    }

                    return acc;
                }, {});

                // Find restaurant with highest earnings
                const restaurantIds = Object.keys(restaurantEarnings);
                if (restaurantIds.length === 0) {
                    setTopRestaurant({ name: 'No data available', totalEarnings: 0 });
                    setLoading(false);
                    return;
                }

                const topRestaurantId = restaurantIds.reduce((a, b) =>
                    restaurantEarnings[a].totalEarnings > restaurantEarnings[b].totalEarnings ? a : b
                );

                // Fetch restaurant details
                try {
                    const restaurantResponse = await axios.get(`http://localhost:5556/api/restaurants/${topRestaurantId}`);
                    setTopRestaurant({
                        ...restaurantResponse.data,
                        ...restaurantEarnings[topRestaurantId]
                    });
                } catch (err) {
                    // If restaurant details can't be fetched, use the ID
                    setTopRestaurant({
                        name: `Restaurant ${topRestaurantId.substring(0, 8)}...`,
                        ...restaurantEarnings[topRestaurantId]
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching top restaurant:', err);
                setLoading(false);
            }
        };

        fetchTopRestaurant();
    }, []);

    return (
        <div className="w-full sm:w-64 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-white border border-white/10">
            <div className="flex flex-col justify-center items-center h-full">
                <span className="text-sm uppercase text-gray-400 tracking-wide">Top Earning Restaurant</span>
                {loading ? (
                    <div className="text-center mt-2">
                        <span className="text-xl font-bold relative overflow-hidden">
                            <span className="invisible">Loading...</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></span>
                        </span>
                    </div>
                ) : (
                    <>
                        <span className="text-xl font-bold mt-2 text-center truncate max-w-full">
                            {topRestaurant?.name || 'Unknown'}
                        </span>
                        <span className="text-3xl font-bold mt-1">
                            Rs. {((topRestaurant?.totalEarnings || 0) / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 mt-1">
                            {topRestaurant?.successfulTransactions || 0} transactions
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default TopEarningRestaurantWidget;