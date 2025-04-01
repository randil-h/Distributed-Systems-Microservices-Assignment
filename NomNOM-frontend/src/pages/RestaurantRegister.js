import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/utility_components/Navbar";

const RestaurantRegister = () => {
    const [formData, setFormData] = useState({
        // Basic Business Information
        name: "",
        legalBusinessName: "",
        registrationNumber: "",
        cuisineType: "",
        restaurantCategory: "",
        // Location and Contact
        address: "",
        phone: "",
        email: "",
        website: "",
        facebook: "",
        instagram: "",
        // Operational Details
        operatingHours: "",
        deliveryOptions: [],
        paymentMethods: [],
        // Owner Information
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cuisineTypes = ["Italian", "Chinese", "Indian", "Mexican", "Japanese", "American", "Mediterranean", "Thai", "French", "Other"];
    const restaurantCategories = ["Fine Dining", "Casual Dining", "Fast Casual", "Quick Service", "Cafe", "Bar/Pub", "Food Truck", "Other"];
    const deliveryOptionsList = ["Delivery", "Pickup", "Dine-in"];
    const paymentMethodsList = ["Credit Card", "Debit Card", "Cash", "Mobile Payment", "Online Payment"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => {
            const currentValues = prev[name] || [];
            if (checked) {
                return { ...prev, [name]: [...currentValues, value] };
            } else {
                return { ...prev, [name]: currentValues.filter(item => item !== value) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication required. Please login.");
                return;
            }

            await axios.post(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/register`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            navigate("/restaurants");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Register Your Restaurant</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                    {/* Basic Business Information Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Business Information</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Restaurant Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Legal Business Name</label>
                            <input
                                type="text"
                                name="legalBusinessName"
                                value={formData.legalBusinessName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Business Registration Number</label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Cuisine Type*</label>
                                <select
                                    name="cuisineType"
                                    value={formData.cuisineType}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
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
                                    value={formData.restaurantCategory}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {restaurantCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location and Contact Information Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Location & Contact</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Address*</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Phone Number*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email Address*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                                placeholder="https://"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Facebook Page</label>
                                <input
                                    type="url"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white"
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Instagram</label>
                                <input
                                    type="url"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white"
                                    placeholder="https://instagram.com/yourpage"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operational Details Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Operational Details</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Operating Hours*</label>
                            <textarea
                                name="operatingHours"
                                value={formData.operatingHours}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                                rows="3"
                                placeholder="Example: Monday-Friday: 11:00 AM - 10:00 PM, Saturday-Sunday: 12:00 PM - 11:00 PM"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Delivery Options*</label>
                            <div className="flex flex-wrap gap-4">
                                {deliveryOptionsList.map(option => (
                                    <label key={option} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="deliveryOptions"
                                            value={option}
                                            checked={formData.deliveryOptions.includes(option)}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Payment Methods*</label>
                            <div className="flex flex-wrap gap-4">
                                {paymentMethodsList.map(method => (
                                    <label key={method} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="paymentMethods"
                                            value={method}
                                            checked={formData.paymentMethods.includes(method)}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Owner Information Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Owner/Administrator Information</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Full Name*</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-white"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email Address*</label>
                                <input
                                    type="email"
                                    name="ownerEmail"
                                    value={formData.ownerEmail}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Phone Number*</label>
                                <input
                                    type="tel"
                                    name="ownerPhone"
                                    value={formData.ownerPhone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded bg-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-nomnom text-white py-2 rounded-full hover:bg-green-600 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Registering..." : "Register Restaurant"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantRegister;