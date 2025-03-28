import { useState, useEffect } from "react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/utility_components/Navbar";
import axios from "axios";

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [showRestaurants, setShowRestaurants] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fetchRestaurants = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRestaurants(response.data);
            setShowRestaurants(true);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    return (
        <div>
            <NavBar/>
            <div className="top-24 flex flex-col z-50 mt-32 p-4">
                <h2 className="text-2xl font-bold mb-4">Restaurant Dashboard</h2>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => navigate("/register-restaurant")}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Register New Restaurant
                    </button>
                    <button
                        onClick={fetchRestaurants}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Show My Restaurants
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>

                {showRestaurants && (
                    <div className="restaurants-list">
                        <h3 className="text-xl font-semibold mb-2">My Restaurants:</h3>
                        {restaurants.length > 0 ? (
                            <ul className="space-y-2">
                                {restaurants.map(restaurant => (
                                    <li key={restaurant._id} className="p-3 border rounded">
                                        <p className="font-medium">{restaurant.name}</p>
                                        <p>{restaurant.address}</p>
                                        <p>Hours: {restaurant.operatingHours || "Not specified"}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No restaurants registered yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDashboard;