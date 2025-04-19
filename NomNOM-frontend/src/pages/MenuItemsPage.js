import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, Plus } from 'lucide-react';
import RestaurantAdminSidebar from '../components/admin_components/RestaurantAdminSidebar';

const MenuItemsPage = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [restaurantRes, menuItemsRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${restaurantId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/restaurant/${restaurantId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setRestaurant(restaurantRes.data);
                setMenuItems(menuItemsRes.data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [restaurantId]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMenuItems(menuItems.filter(item => item._id !== id));
        } catch (err) {
            console.error('Failed to delete menu item:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <RestaurantAdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Menu for {restaurant?.name}
                    </h1>
                    <button
                        onClick={() => navigate(`/add-menu-item/${restaurantId}`)}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Menu Item
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <div key={item._id} className="border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-gray-600">{item.category}</p>
                                </div>
                                <span className="font-bold">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="my-2 text-sm">{item.description}</p>
                            {item.ingredients && item.ingredients.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    Ingredients: {item.ingredients.join(', ')}
                                </p>
                            )}
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    onClick={() => navigate(`/edit-menu-item/${item._id}`)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuItemsPage;