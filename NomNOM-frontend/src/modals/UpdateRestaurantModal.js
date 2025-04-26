import React, { useEffect } from "react";

const UpdateRestaurantModal = ({
                                   isOpen,
                                   onClose,
                                   restaurant,
                                   onUpdate,
                                   editedData,
                                   setEditedData,
                               }) => {
    // Initialize editedData when modal opens
    useEffect(() => {
        if (isOpen && restaurant) {
            setEditedData({
                name: restaurant.name || "",
                legalBusinessName: restaurant.legalBusinessName || "",
                registrationNumber: restaurant.registrationNumber || "",
                description: restaurant.description || "",
                cuisineType: restaurant.cuisineType || "",
                restaurantCategory: restaurant.restaurantCategory || "",
                address: restaurant.address || "",
                phone: restaurant.phone || "",
                email: restaurant.email || "",
                website: restaurant.website || "",
                facebook: restaurant.facebook || "",
                instagram: restaurant.instagram || "",
                operatingHours: restaurant.operatingHours || "",
                deliveryOptions: [...(restaurant.deliveryOptions || [])],
                paymentMethods: [...(restaurant.paymentMethods || [])],
                ownerName: restaurant.ownerName || "",
                ownerEmail: restaurant.ownerEmail || "",
                ownerPhone: restaurant.ownerPhone || "",
                logo: restaurant.logo || null,
                coverImage: restaurant.coverImage || null,
            });
        }
    }, [isOpen, restaurant, setEditedData]); // Reverted dependency array

    if (!isOpen || !restaurant) return null;


    if (!isOpen || !restaurant) return null;

    const cuisineTypes = ["Italian", "Chinese", "Indian", "Mexican", "Japanese", "American", "Mediterranean", "Thai", "French", "Other"];
    const restaurantCategories = ["Fine Dining", "Casual Dining", "Fast Casual", "Quick Service", "Cafe", "Bar/Pub", "Food Truck", "Other"];
    const deliveryOptionsList = ["Delivery", "Pickup", "Dine-in"];
    const paymentMethodsList = ["Credit Card", "Debit Card", "Cash", "Mobile Payment", "Online Payment"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setEditedData(prev => {
            const currentValues = prev[name] || [];
            if (checked) {
                return { ...prev, [name]: [...currentValues, value] };
            } else {
                return { ...prev, [name]: currentValues.filter(item => item !== value) };
            }
        });
    };

    const handleImageUpload = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedData(prev => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Business Information */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Business Information</h3>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Restaurant Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={editedData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Legal Business Name</label>
                        <input
                            type="text"
                            name="legalBusinessName"
                            value={editedData.legalBusinessName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Business Registration Number</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={editedData.registrationNumber}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Restaurant Description */}
                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Restaurant Description</h3>
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={editedData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Tell us more about your restaurant..."
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Cuisine Type*</label>
                        <select
                            name="cuisineType"
                            value={editedData.cuisineType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Cuisine Type</option>
                            {cuisineTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Restaurant Category*</label>
                        <select
                            name="restaurantCategory"
                            value={editedData.restaurantCategory}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {restaurantCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location and Contact Information */}
                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Location & Contact</h3>
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Address*</label>
                        <input
                            type="text"
                            name="address"
                            value={editedData.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Phone Number*</label>
                        <input
                            type="tel"
                            name="phone"
                            value={editedData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email Address*</label>
                        <input
                            type="email"
                            name="email"
                            value={editedData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={editedData.website}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Facebook</label>
                        <input
                            type="url"
                            name="facebook"
                            value={editedData.facebook}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://facebook.com/yourpage"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Instagram</label>
                        <input
                            type="url"
                            name="instagram"
                            value={editedData.instagram}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://instagram.com/yourpage"
                        />
                    </div>

                    {/* Operational Details */}
                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Operational Details</h3>
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Operating Hours*</label>
                        <textarea
                            name="operatingHours"
                            value={editedData.operatingHours}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Example: Monday-Friday: 11:00 AM - 10:00 PM, Saturday-Sunday: 12:00 PM - 11:00 PM"
                            required
                        />
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Delivery Options*</label>
                        <div className="flex flex-wrap gap-4">
                            {deliveryOptionsList.map(option => (
                                <label key={option} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="deliveryOptions"
                                        value={option}
                                        checked={editedData.deliveryOptions?.includes(option)}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Payment Methods*</label>
                        <div className="flex flex-wrap gap-4">
                            {paymentMethodsList.map(method => (
                                <label key={method} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="paymentMethods"
                                        value={method}
                                        checked={editedData.paymentMethods?.includes(method)}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-gray-700">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Restaurant Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="logo"
                            onChange={handleImageUpload}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {editedData.logo && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Current Logo:</p>
                                <img
                                    src={editedData.logo}
                                    alt="Logo Preview"
                                    className="h-24 mt-2 border border-gray-300 rounded"
                                />
                            </div>
                        )}
                    </div>

                    {/* New Cover Image Update */}
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 mb-2">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="coverImage"
                            onChange={handleImageUpload}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {editedData.coverImage && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Current Cover Image:</p>
                                <img
                                    src={editedData.coverImage}
                                    alt="Cover Image Preview"
                                    className="h-32 mt-2 border border-gray-300 rounded object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Owner Information */}
                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Owner/Administrator Information</h3>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name*</label>
                        <input
                            type="text"
                            name="ownerName"
                            value={editedData.ownerName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email Address*</label>
                        <input
                            type="email"
                            name="ownerEmail"
                            value={editedData.ownerEmail}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Phone Number*</label>
                        <input
                            type="tel"
                            name="ownerPhone"
                            value={editedData.ownerPhone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-red-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onUpdate}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-green-500 transition-colors"
                    >
                        Update Restaurant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateRestaurantModal;