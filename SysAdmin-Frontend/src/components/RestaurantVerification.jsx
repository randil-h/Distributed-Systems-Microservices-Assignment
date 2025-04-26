import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import RestaurantDetailsModal from './RestaurantDetailsModal';
import '../assets/animations.css';

const RestaurantVerification = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchPendingRestaurants();
    }, []);

    const fetchPendingRestaurants = async () => {
        try {
            const response = await axios.get('http://localhost:5556/api/restaurants/pending', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsModalOpen(true);
        setRejectionReason('');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRestaurant(null);
        setRejectionReason('');
    };

    const handleAccept = async (restaurantId) => {
        setLoading(true);
        try {
            await axios.put(
                `http://localhost:5556/api/restaurants/${restaurantId}`,
                {
                    registrationStatus: 'accepted'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setRestaurants(restaurants.map(r =>
                r._id === restaurantId ? { ...r, registrationStatus: 'accepted' } : r
            ));
            closeModal();
            alert(`Restaurant has been approved successfully.`);
        } catch (error) {
            console.error('Error accepting restaurant:', error);
            alert('Failed to approve restaurant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (restaurantId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `http://localhost:5556/api/restaurants/${restaurantId}`,
                {
                    registrationStatus: 'rejected',
                    rejectionReason: rejectionReason
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setRestaurants(restaurants.map(r =>
                r._id === restaurantId ? { ...r, registrationStatus: 'rejected', rejectionReason } : r
            ));
            closeModal();
            alert(`Restaurant has been rejected.`);
        } catch (error) {
            console.error('Error rejecting restaurant:', error);
            alert('Failed to reject restaurant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container w-5/6 fixed right-0 top-20 mx-auto px-4 py-8">
            <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 to-lime-600 p-6">
                    <h2 className="text-3xl font-bold text-white flex items-center">
                        <AlertCircle className="mr-3 w-8 h-8" />
                        Restaurants Pending Verification
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6">
                        <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent h-12 mb-4 rounded"></div>
                        <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent h-12 mb-4 rounded"></div>
                        <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent h-12 mb-4 rounded"></div>
                    </div>
                ) : restaurants.filter(r => r.registrationStatus === 'pending').length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                        <p className="text-xl">No restaurants are currently pending verification.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                            <tr>
                                {['Restaurant Name', 'Owner', 'Address', 'Cuisine', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {restaurants
                                .filter(r => r.registrationStatus === 'pending')
                                .map(restaurant => (
                                    <tr key={restaurant._id} className="hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.ownerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.cuisineType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => openModal(restaurant)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
                                            >
                                                <AlertCircle className="mr-2 w-4 h-4" />
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && selectedRestaurant && (
                <RestaurantDetailsModal
                    restaurant={selectedRestaurant}
                    rejectionReason={rejectionReason}
                    setRejectionReason={setRejectionReason}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onClose={closeModal}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default RestaurantVerification;