import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMenuItemModal = ({ isOpen, onClose, onSave, restaurantId }) => {
    // Define initial form state outside component to avoid recreation
    const initialFormData = {
        name: '',
        description: '',
        price: 0,
        category: '',
        ingredients: '',
        dietaryRestrictions: [],
        preparationTime: 0,
        image: '',
        isAvailable: true,
        restaurantId: restaurantId
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = React.useRef(null);

    const dietaryOptions = [
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Dairy-Free',
        'Nut-Free',
        'Kosher',
        'Halal'
    ];

    // Reset form when modal opens or restaurantId changes
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, restaurantId]);

    const resetForm = () => {
        setFormData(initialFormData);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDietaryChange = (option) => {
        setFormData(prev => {
            const newRestrictions = prev.dietaryRestrictions.includes(option)
                ? prev.dietaryRestrictions.filter(item => item !== option)
                : [...prev.dietaryRestrictions, option];
            return {
                ...prev,
                dietaryRestrictions: newRestrictions
            };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
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

            const response = await axios.post(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items`,
                dataToSend,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            onSave(response.data);
            resetForm(); // Reset form after successful submission
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save menu item');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">Add New Menu Item</h1>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price* ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category*</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a category</option>
                                <option value="Appetizers">Appetizers</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Sides">Sides</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dietary Restrictions
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {dietaryOptions.map(option => (
                                    <div key={option} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`add-dietary-${option}`}
                                            checked={formData.dietaryRestrictions.includes(option)}
                                            onChange={() => handleDietaryChange(option)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`add-dietary-${option}`} className="ml-2 text-sm text-gray-700">
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preparation Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preparation Time (minutes)</label>
                            <input
                                type="number"
                                name="preparationTime"
                                value={formData.preparationTime}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                            {formData.image && (
                                <div className="mt-2">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                id="add-isAvailable"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="add-isAvailable" className="ml-2 block text-sm text-gray-700">
                                Available
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-red-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-4 py-2 rounded-md hover:bg-green-500 disabled:bg-blue-300"
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

export default AddMenuItemModal;