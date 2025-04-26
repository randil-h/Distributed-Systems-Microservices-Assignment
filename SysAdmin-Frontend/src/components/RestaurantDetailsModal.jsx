import React from 'react';
import { CheckCircle2, XCircle, X, Globe, Phone, Mail, Clock, CreditCard, Truck, Facebook, Instagram, Loader2 } from 'lucide-react';

const RestaurantDetailsModal = ({
                                    restaurant,
                                    rejectionReason,
                                    setRejectionReason,
                                    onAccept,
                                    onReject,
                                    onClose,
                                    loading
                                }) => {
    const renderSection = (title, content) => (
        <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-200 mb-2">{title}</h4>
            <div className="bg-gray-700 p-4 rounded-lg text-gray-300">{content}</div>
        </div>
    );

    const renderInfoItem = (icon, label, value) => {
        if (!value) return null;
        return (
            <div className="flex items-start mb-2">
                {icon}
                <div className="ml-3">
                    <span className="text-gray-400 text-sm">{label}</span>
                    <p className="text-gray-300">{value}</p>
                </div>
            </div>
        );
    };

    const renderArrayItems = (items) => {
        if (!items || items.length === 0) return "None specified";
        return items.join(", ");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl relative max-h-screen overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 to-lime-600 p-6 rounded-t-xl">
                    <h3 className="text-2xl font-bold text-white">{restaurant.name} - Verification</h3>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            {/* Restaurant Images */}
                            {(restaurant.logo || restaurant.coverImage) && renderSection("Images",
                                <div className="space-y-4">
                                    {restaurant.logo && (
                                        <div>
                                            <p className="text-gray-400 mb-2">Logo</p>
                                            <img
                                                src={restaurant.logo}
                                                alt="Restaurant Logo"
                                                className="h-24 object-contain rounded-md"
                                            />
                                        </div>
                                    )}
                                    {restaurant.coverImage && (
                                        <div>
                                            <p className="text-gray-400 mb-2">Cover Image</p>
                                            <img
                                                src={restaurant.coverImage}
                                                alt="Restaurant Cover"
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Basic Information */}
                            {renderSection("Business Information",
                                <div className="space-y-2">
                                    {renderInfoItem(<span className="w-5"></span>, "Restaurant Name", restaurant.name)}
                                    {renderInfoItem(<span className="w-5"></span>, "Legal Business Name", restaurant.legalBusinessName)}
                                    {renderInfoItem(<span className="w-5"></span>, "Registration Number", restaurant.registrationNumber)}
                                    {renderInfoItem(<span className="w-5"></span>, "Cuisine Type", restaurant.cuisineType)}
                                    {renderInfoItem(<span className="w-5"></span>, "Category", restaurant.restaurantCategory)}
                                </div>
                            )}

                            {/* Description */}
                            {restaurant.description && renderSection("Description",
                                <p className="text-gray-300">{restaurant.description}</p>
                            )}

                            {/* Owner Information */}
                            {renderSection("Owner Information",
                                <div className="space-y-2">
                                    {renderInfoItem(<span className="w-5"></span>, "Name", restaurant.ownerName)}
                                    {renderInfoItem(
                                        <Mail className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Email",
                                        restaurant.ownerEmail
                                    )}
                                    {renderInfoItem(
                                        <Phone className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Phone",
                                        restaurant.ownerPhone
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            {/* Location and Contact */}
                            {renderSection("Location & Contact",
                                <div className="space-y-3">
                                    {renderInfoItem(<span className="w-5"></span>, "Address", restaurant.address)}
                                    {renderInfoItem(
                                        <Phone className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Phone",
                                        restaurant.phone
                                    )}
                                    {renderInfoItem(
                                        <Mail className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Email",
                                        restaurant.email
                                    )}
                                    {renderInfoItem(
                                        <Globe className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Website",
                                        restaurant.website
                                    )}
                                    {renderInfoItem(
                                        <Facebook className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Facebook",
                                        restaurant.facebook
                                    )}
                                    {renderInfoItem(
                                        <Instagram className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Instagram",
                                        restaurant.instagram
                                    )}
                                </div>
                            )}

                            {/* Operational Details */}
                            {renderSection("Operational Details",
                                <div className="space-y-3">
                                    {renderInfoItem(
                                        <Clock className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Operating Hours",
                                        restaurant.operatingHours
                                    )}
                                    {renderInfoItem(
                                        <Truck className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Delivery Options",
                                        renderArrayItems(restaurant.deliveryOptions)
                                    )}
                                    {renderInfoItem(
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-1" />,
                                        "Payment Methods",
                                        renderArrayItems(restaurant.paymentMethods)
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    <div className="mt-6">
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-300 mb-2">
                            Rejection Reason
                        </label>
                        <textarea
                            id="rejectionReason"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection"
                            rows="3"
                            disabled={loading}
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={() => onAccept(restaurant._id)}
                            className="flex-1 flex items-center justify-center bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="mr-2 w-5 h-5" />
                            )}
                            Approve Restaurant
                        </button>
                        <button
                            onClick={() => onReject(restaurant._id)}
                            className="flex-1 flex items-center justify-center bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            ) : (
                                <XCircle className="mr-2 w-5 h-5" />
                            )}
                            Reject Registration
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-200 hover:text-white disabled:text-gray-500"
                    disabled={loading}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default RestaurantDetailsModal;