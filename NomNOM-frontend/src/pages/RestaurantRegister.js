import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/utility_components/Navbar";

const RestaurantRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        operatingHours: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/register`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            navigate("/"); // Or wherever you want to redirect after registration
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

                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Restaurant Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Operating Hours</label>
                        <input
                            type="text"
                            name="operatingHours"
                            value={formData.operatingHours}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-white"
                            placeholder="e.g., 9AM - 10PM"
                        />
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