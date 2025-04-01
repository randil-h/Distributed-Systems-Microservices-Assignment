import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/utility_components/Navbar";
import UpdateRestaurantModal from "../modals/UpdateRestaurantModal";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRestaurants(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchRestaurants();
        } catch (err) {
            setError(err);
        }
    };

    const handleEdit = (restaurant) => {
        setEditingRestaurant(restaurant);
        setEditedData({
            name: restaurant.name,
            legalBusinessName: restaurant.legalBusinessName || "",
            registrationNumber: restaurant.registrationNumber || "",
            cuisineType: restaurant.cuisineType || "",
            restaurantCategory: restaurant.restaurantCategory || "",
            address: restaurant.address,
            phone: restaurant.phone || "",
            email: restaurant.email || "",
            website: restaurant.website || "",
            facebook: restaurant.facebook || "",
            instagram: restaurant.instagram || "",
            operatingHours: restaurant.operatingHours,
            deliveryOptions: restaurant.deliveryOptions || [],
            paymentMethods: restaurant.paymentMethods || [],
            ownerName: restaurant.ownerName || "",
            ownerEmail: restaurant.ownerEmail || "",
            ownerPhone: restaurant.ownerPhone || ""
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${editingRestaurant._id}`,
                editedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setIsModalOpen(false);
            fetchRestaurants();
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading restaurants...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-500">
                    Error loading restaurants: {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="container mx-auto px-4 py-8 mt-24">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">
                    Registered Restaurants
                </h2>

                {restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((restaurant) => (
                            <div
                                key={restaurant._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Restaurant Image Placeholder */}
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                        <span className="text-gray-500">No Image Available</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                        {restaurant.name}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Address:</span> {restaurant.address}
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-medium">Hours:</span> {restaurant.operatingHours || "Not specified"}
                                    </p>

                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => handleEdit(restaurant)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(restaurant._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No restaurants registered yet.</p>
                    </div>
                )}

                <UpdateRestaurantModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    restaurant={editingRestaurant}
                    onUpdate={handleUpdate}
                    editedData={editedData}
                    setEditedData={setEditedData}
                />
            </div>
        </div>
    );
};

export default RestaurantList;