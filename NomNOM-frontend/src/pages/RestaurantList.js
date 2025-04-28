import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit3, Trash2, Plus, Menu, X } from "lucide-react";
import UpdateRestaurantModal from "../modals/UpdateRestaurantModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import RestaurantAdminSidebar from '../components/admin_components/RestaurantAdminSidebar';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
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
        setDeleteError(null);
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

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Loading restaurants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-700 p-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <X className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-3">Access Denied</h1>
                <p className="text-base text-center px-6 max-w-md mb-6 text-gray-600">
                    We couldn't load the restaurant list. Please check your permissions or try again later.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('role');
                            window.location.href = '/login';
                        }}
                        className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        Login with Proper Permissions
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                    {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar Component */}
            <RestaurantAdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                fetchRestaurants={fetchRestaurants}
                handleLogout={handleLogout}
            />

            {/* Main Content Area - Removed container mx-auto to prevent centering */}
            <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-6 pl-6' : 'ml-0 pl-0'}`}>
                <div className="px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
                            <p className="text-gray-500 mt-1">Manage your restaurant listings</p>
                        </div>
                        {/* Changed Add Restaurant button to black */}
                        <button
                            onClick={() => navigate("/register-restaurant")}
                            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-md"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Restaurant
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search restaurants..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRestaurants.map((restaurant) => (
                                <div
                                    key={restaurant._id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
                                >
                                    {/* Restaurant Image */}
                                    <div className="h-80 bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden relative">
                                        {restaurant.logo ? (
                                            <img
                                                src={restaurant.logo}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">No logo available</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                                                {restaurant.name}
                                            </h3>
                                            {restaurant.cuisineType && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-2">
                                                    {restaurant.cuisineType}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm">{restaurant.address}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">{restaurant.operatingHours || "Hours not specified"}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => navigate(`/menu-items/${restaurant._id}`)}
                                                className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                <BookOpen className="w-4 h-4 mr-1" />
                                                View Menu
                                            </button>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(restaurant)}
                                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => showDeleteConfirmation(restaurant)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
                            <p className="mt-1 text-gray-500">
                                {searchTerm ? "Try adjusting your search query." : "Get started by adding a new restaurant."}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate("/add-restaurant")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                    Add Restaurant
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
    );
};

export default RestaurantList;