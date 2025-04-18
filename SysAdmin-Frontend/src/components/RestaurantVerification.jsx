import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

const initialRestaurants = [
    { id: 1, name: 'Delicious Burgers', owner: 'John Doe', address: '123 Main St', status: 'pending' },
    { id: 2, name: 'Pizza Place', owner: 'Jane Smith', address: '456 Oak Ave', status: 'pending' },
    { id: 3, name: 'Sushi House', owner: 'Kenji Tanaka', address: '789 Pine Ln', status: 'pending' },
];

const RestaurantVerification = () => {
    const [restaurants, setRestaurants] = useState(initialRestaurants);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

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

    const handleAccept = (restaurantId) => {
        setRestaurants(restaurants.map(r =>
            r.id === restaurantId ? { ...r, status: 'accepted' } : r
        ));
        closeModal();
        alert(`Restaurant ID ${restaurantId} accepted.`); // Replace with actual API call
    };

    const handleReject = (restaurantId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }
        setRestaurants(restaurants.map(r =>
            r.id === restaurantId ? { ...r, status: 'rejected', rejectionReason } : r
        ));
        closeModal();
        alert(`Restaurant ID ${restaurantId} rejected with reason: ${rejectionReason}`); // Replace with actual API call
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

                {restaurants.filter(r => r.status === 'pending').length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                        <p className="text-xl">No restaurants are currently pending verification.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                            <tr>
                                {['Restaurant Name', 'Owner', 'Address', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {restaurants
                                .filter(r => r.status === 'pending')
                                .map(restaurant => (
                                    <tr key={restaurant.id} className="hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.owner}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{restaurant.address}</td>
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
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full relative">
                        <div className="bg-gradient-to-r from-emerald-700 to-lime-600 p-6 rounded-t-xl">
                            <h3 className="text-2xl font-bold text-white">Restaurant Details</h3>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                <p><span className="font-semibold text-gray-300">Name:</span> <span className="text-gray-300">{selectedRestaurant.name}</span></p>
                                <p><span className="font-semibold text-gray-300">Owner:</span> <span className="text-gray-300">{selectedRestaurant.owner}</span></p>
                                <p><span className="font-semibold text-gray-300">Address:</span> <span className="text-gray-300">{selectedRestaurant.address}</span></p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-300 mb-2">
                                    Rejection Reason
                                </label>
                                <textarea
                                    id="rejectionReason"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter reason for rejection"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleAccept(selectedRestaurant.id)}
                                    className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <CheckCircle2 className="mr-2 w-5 h-5" />
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(selectedRestaurant.id)}
                                    className="flex-1 flex items-center justify-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    <XCircle className="mr-2 w-5 h-5" />
                                    Reject
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantVerification;