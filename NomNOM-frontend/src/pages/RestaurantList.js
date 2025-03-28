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
            await axios.delete(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchRestaurants(); // Refresh list after delete
        } catch (err) {
            setError(err);
        }
    };

    const handleEdit = (restaurant) => {
        setEditingRestaurant(restaurant);
        setEditedData({
            name: restaurant.name,
            address: restaurant.address,
            operatingHours: restaurant.operatingHours,
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `<span class="math-inline">\{process\.env\.REACT\_APP\_RESTAURANT\_API\_URL\}/</span>{editingRestaurant._id}`;
            console.log("Update URL:", url);
            console.log("Restaurant ID:", editingRestaurant._id);
            console.log("update data", editedData);
            await axios.put(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${editingRestaurant._id}`,
                editedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditingRestaurant(null);
            setIsModalOpen(false);
            fetchRestaurants(); // Refresh list after update
        } catch (err) {
            setError(err);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <p>Loading restaurants...</p>;
    }

    if (error) {
        return <p>Error loading restaurants: {error.message}</p>;
    }

    return (
        <div>
            <NavBar />
            <div className="top-24 mt-32 p-4">
                <h2 className="text-2xl font-bold mb-4">Registered Restaurants</h2>
                {restaurants.length > 0 ? (
                    <ul className="space-y-2">
                        {restaurants.map((restaurant) => (
                            <li key={restaurant._id} className="p-3 border rounded">
                                <p className="font-medium">{restaurant.name}</p>
                                <p>{restaurant.address}</p>
                                <p>Hours: {restaurant.operatingHours || "Not specified"}</p>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => handleEdit(restaurant)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => handleDelete(restaurant._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No restaurants registered yet.</p>
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