import React, { useState, useEffect } from 'react';
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { List, Clock } from 'lucide-react';
import axios from "axios";
import RestaurantAdminSidebar from '../components/admin_components/RestaurantAdminSidebar';
import NavBar from "../components/utility_components/Navbar";

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fetchRestaurants = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <NavBar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
            />

            {/* Sidebar Component */}
            <RestaurantAdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                fetchRestaurants={fetchRestaurants}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8 mt-12">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Restaurant Management
                        </h2>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Total Restaurants</h3>
                            <p className="text-3xl font-semibold mt-2">{restaurants.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Active Locations</h3>
                            <p className="text-3xl font-semibold mt-2">3</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500">Staff Members</h3>
                            <p className="text-3xl font-semibold mt-2">24</p>
                        </div>
                    </div>

                    {/* Restaurants List */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">My Restaurants</h3>
                            <button
                                onClick={fetchRestaurants}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                                <List className="w-4 h-4 mr-1" />
                                Refresh
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : restaurants.length > 0 ? (
                            <ul className="divide-y">
                                {restaurants.map((restaurant, index) => (
                                    <li
                                        key={restaurant._id}
                                        className={`p-4 transition-colors ${index % 2 === 0 ? 'bg-gray-100' : 'bg-green-50'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>{restaurant.operatingHours || "Hours not specified"}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">

                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>No restaurants found</p>
                                <button
                                    onClick={() => navigate("/register-restaurant")}
                                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Add your first restaurant
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;