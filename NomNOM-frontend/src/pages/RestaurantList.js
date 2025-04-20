import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/utility_components/Navbar";
import UpdateRestaurantModal from "../modals/UpdateRestaurantModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import RestaurantAdminSidebar from '../components/admin_components/RestaurantAdminSidebar';
import {useNavigate} from "react-router-dom"; // Import the sidebar

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
    const navigate = useNavigate(); // Import useNavigate

    useEffect(() => {
        fetchRestaurants();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token
        navigate("/login");
    };

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
    const showDeleteConfirmation = (restaurant) => {
        setRestaurantToDelete(restaurant);
        setDeleteModalOpen(true);
        setDeleteError(null); // Reset any previous errors
    };

    const hideDeleteConfirmation = () => {
        setDeleteModalOpen(false);
        setRestaurantToDelete(null);
        setIsDeleting(false);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${restaurantToDelete._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200) {
                await fetchRestaurants();
                hideDeleteConfirmation();
            }
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Failed to delete restaurant");
            console.error("Delete error:", err);
        } finally {
            setIsDeleting(false);
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
            ownerPhone: restaurant.ownerPhone || "",
            logo: restaurant.logo || null
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
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-700">
                <div className="text-6xl mb-4 text-red-400">
                    🚫
                </div>
                <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
                <p className="text-base text-center px-6 max-w-md">
                    Sorry, we couldn't load the restaurant list. You might not have permission to view this content or something went wrong on our end.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Component */}
            <RestaurantAdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                fetchRestaurants={fetchRestaurants} // Pass the fetchRestaurants function
                handleLogout={handleLogout}       // Pass the handleLogout function
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8 mt-0"> {/* Adjust marginTop to account for NavBar */}
                <div className="container mx-auto px-4 py-8">
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
                                        {restaurant.logo ? (
                                            <img
                                                src={restaurant.logo}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                                <span className="text-gray-500">No Image Available</span>
                                            </div>
                                        )}
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
                                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-800 hover:text-white transition-colors"
                                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-800 hover:text-white transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => showDeleteConfirmation(restaurant)}
                                                className="px-4 py-2 bg-red-200 text-red-800 rounded-md hover:bg-red-700 hover:text-white transition-colors"
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
                    <DeleteConfirmationModal
                        isOpen={deleteModalOpen}
                        onClose={hideDeleteConfirmation}
                        onConfirm={handleDelete}
                        itemName={restaurantToDelete?.name || ""}
                        isDeleting={isDeleting}
                        error={deleteError}
                    />
                </div>
            </div>
        </div>
    );
};

export default RestaurantList;