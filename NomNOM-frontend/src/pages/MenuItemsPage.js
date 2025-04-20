import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, Plus } from 'lucide-react';
import RestaurantAdminSidebar from '../components/admin_components/RestaurantAdminSidebar';
import EditMenuItemModal from '../modals/EditMenuItemModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import AddMenuItemModal from '../modals/AddMenuItemModal'; // Import the new modal

const MenuItemsPage = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal

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

    const confirmDeleteItem = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
        setDeleteError(null);
    };

    const performDeleteItem = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/${itemToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMenuItems(menuItems.filter(item => item._id !== itemToDelete._id));
            closeDeleteModal();
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete menu item');
            console.error('Failed to delete menu item:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
        setIsDeleting(false);
        setDeleteError(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const openEditModal = (item) => {
        setEditingMenuItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingMenuItem(null);
    };

    const handleSaveEditedItem = async (updatedItem) => {
        try {
            setMenuItems(prevItems =>
                prevItems.map(item => (item._id === updatedItem._id ? updatedItem : item))
            );
            closeEditModal();
        } catch (err) {
            console.error('Failed to save edited item in parent:', err);
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleSaveNewItem = async (newItem) => {
        try {
            setMenuItems(prevItems => [...prevItems, newItem]);
            closeAddModal();
            // Optionally, show a success message
        } catch (err) {
            console.error('Failed to save new item in parent:', err);
            // Optionally, show an error message
        }
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
                        onClick={openAddModal} // Open the add modal instead of navigating
                        className="flex items-center bg-black text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Menu Item
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <div key={item._id} className="border rounded-lg shadow-sm overflow-hidden">
                            {/* Image Section */}
                            {item.image && (
                                <div className="h-32 bg-gray-200 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">{item.category}</p>
                                    </div>
                                    <span className="font-bold">${item.price.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                                {item.ingredients && item.ingredients.length > 0 && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        Ingredients: {item.ingredients.join(', ')}
                                    </p>
                                )}
                                <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                    >
                                        <Edit className="w-4 h-4"/>
                                    </button>
                                    <button
                                        onClick={() => confirmDeleteItem(item)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {editingMenuItem && (
                    <EditMenuItemModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        menuItem={editingMenuItem}
                        onSave={handleSaveEditedItem}
                        restaurantId={restaurantId}
                    />
                )}

                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={performDeleteItem}
                    itemName={itemToDelete?.name || ''}
                    isDeleting={isDeleting}
                    error={deleteError}
                />

                <AddMenuItemModal
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onSave={handleSaveNewItem}
                    restaurantId={restaurantId}
                />
            </div>
        </div>
    );
};

export default MenuItemsPage;