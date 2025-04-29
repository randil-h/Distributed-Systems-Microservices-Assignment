import React from 'react';

const DeleteConfirmationModal = ({
                                     isOpen,
                                     onClose,
                                     onConfirm,
                                     itemName,
                                     isDeleting = false,
                                     error = null
                                 }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <p className="mb-6">
                    Are you sure you want to delete <span className="font-semibold">"{itemName}"</span>?
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className={`px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;