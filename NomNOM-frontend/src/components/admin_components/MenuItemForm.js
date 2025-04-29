import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantAdminSidebar from '../admin_components/RestaurantAdminSidebar';

const MenuItemForm = ({ isEdit = false }) => {
    const { restaurantId, id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        ingredients: '',
        dietaryRestrictions: [],
        preparationTime: 0,
        image: '',
        isAvailable: true,
        restaurantId: restaurantId || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (isEdit && id) {
            const fetchMenuItem = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFormData({
                        ...res.data,
                        ingredients: res.data.ingredients.join(', '),
                        dietaryRestrictions: res.data.dietaryRestrictions || []
                    });
                } catch (err) {
                    setError('Failed to fetch menu item');
                    console.error(err);
                }
            };
            fetchMenuItem();
        }
    }, [isEdit, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...formData,
                ingredients: formData.ingredients.split(',').map(i => i.trim()),
                price: parseFloat(formData.price),
                preparationTime: parseInt(formData.preparationTime)
            };

            if (isEdit) {
                await axios.put(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/${id}`, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items`, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            navigate(`/menu-items/${restaurantId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save menu item');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <RestaurantAdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6">
                        {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h1>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>


                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenuItemForm;