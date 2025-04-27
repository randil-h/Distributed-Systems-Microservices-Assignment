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
    const [availableItems, setAvailableItems] = useState([]);
    const [unavailableItems, setUnavailableItems] = useState([]);
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

    useEffect(() => {
        setAvailableItems(menuItems.filter(item => item.isAvailable));
        setUnavailableItems(menuItems.filter(item => !item.isAvailable));
    }, [menuItems]);

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

    const handleAvailabilityChange = async (itemId, newAvailability) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/${itemId}/availability`,
                { isAvailable: newAvailability },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the local state to reflect the change immediately
            setMenuItems(prevItems =>
                prevItems.map(item =>
                    item._id === itemId ? { ...item, isAvailable: newAvailability } : item
                )
            );
        } catch (error) {
            console.error('Failed to update availability:', error);
            // Optionally, show an error message to the user
        }
    };

    const renderMenuItem = (item) => (
        <div
            key={item._id}
            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${!item.isAvailable ? 'opacity-50' : ''}`}
        >
            {/* Image Section */}
            <div className="relative h-40 bg-gray-100 overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg truncate">{item.name}</h3>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-1">
                            {item.category}
                        </span>
                    </div>
                    <span className="font-bold text-gray-800 ml-2 whitespace-nowrap">
                        ${item.price.toFixed(2)}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                </p>

                {item.ingredients && item.ingredients.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Ingredients:</p>
                        <div className="flex flex-wrap gap-1">
                            {item.ingredients.slice(0, 3).map((ingredient, idx) => (
                                <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                    {ingredient}
                                </span>
                            ))}
                            {item.ingredients.length > 3 && (
                                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                    +{item.ingredients.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4 items-center">
                    <label className="inline-flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Available</span>
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-green-500 focus:ring-green-500 rounded"
                            checked={item.isAvailable}
                            onChange={(e) => handleAvailabilityChange(item._id, e.target.checked)}
                        />
                    </label>
                    <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Edit item"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => confirmDeleteItem(item)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Delete item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="text-red-500 text-lg font-medium">{error}</div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <RestaurantAdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
            />

            <div className="flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                {restaurant?.name} Menu
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Menu Item
                        </button>
                    </div>

                    {/* Available Menu Items */}
                    {availableItems.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Available</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {availableItems.map(renderMenuItem)}
                            </div>
                        </section>
                    )}

                    {/* Unavailable Menu Items */}
                    {unavailableItems.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Unavailable</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {unavailableItems.map(renderMenuItem)}
                            </div>
                        </section>
                    )}

                    {menuItems.length === 0 && (
                        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No menu items yet</h3>
                            <p className="text-gray-500 mb-4">Add your first menu item to get started</p>
                            <button
                                onClick={openAddModal}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Create Menu Item
                            </button>
                        </div>
                    )}
                </div>

                {/* Modals */}
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