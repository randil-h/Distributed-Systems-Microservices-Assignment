import React from 'react';

const UpdateRestaurantModal = ({ isOpen, onClose, onUpdate, editedData, setEditedData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative p-12 bg-gray-800 rounded-xl shadow-lg w-full max-w-md"> {/* Increased padding and dark background */}
                <h3 className="text-2xl font-semibold mb-8 text-white">Edit Restaurant</h3> {/* White text */}

                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        placeholder="Restaurant Name"
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={editedData.address}
                        onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                        placeholder="Restaurant Address"
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-8">
                    <label htmlFor="hours" className="block text-sm font-medium text-gray-300">Operating Hours</label>
                    <input
                        type="text"
                        id="hours"
                        value={editedData.operatingHours || ""}
                        onChange={(e) => setEditedData({ ...editedData, operatingHours: e.target.value })}
                        placeholder="e.g., 9:00 AM - 10:00 PM"
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={onUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg">
                        Update
                    </button>
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateRestaurantModal;