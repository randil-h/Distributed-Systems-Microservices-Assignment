import React, { useState } from 'react';
import { Users, Truck, Building2, Shield, Trash2, Ban, Plus } from 'lucide-react';

// Dummy user data
const initialUsers = [
    { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com', role: 'user' },
    { id: 2, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'delivery_rider' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'restaurant_admin' },
    { id: 4, name: 'David Davis', email: 'david.davis@example.com', role: 'system_admin' },
    { id: 5, name: 'Eve Wilson', email: 'eve.wilson@example.com', role: 'user' },
    { id: 6, name: 'Frank Miller', email: 'frank.miller@example.com', role: 'delivery_rider' },
    { id: 7, name: 'Grace Taylor', email: 'grace.taylor@example.com', role: 'restaurant_admin' },
    { id: 8, name: 'Henry Moore', email: 'henry.moore@example.com', role: 'system_admin' },
    { id: 9, name: 'Ivy Green', email: 'ivy.green@example.com', role: 'user' },
    { id: 10, name: 'Jack White', email: 'jack.white@example.com', role: 'delivery_rider' },
    { id: 11, name: 'Kelly Black', email: 'kelly.black@example.com', role: 'restaurant_admin' },
    { id: 12, name: 'Liam Grey', email: 'liam.grey@example.com', role: 'system_admin' },
];

// Role configuration for consistent styling
const ROLE_CONFIG = {
    user: {
        label: 'User',
        icon: Users,
        activeColor: 'bg-blue-500 text-white',
        inactiveColor: 'bg-blue-50 text-blue-600'
    },
    delivery_rider: {
        label: 'Delivery Rider',
        icon: Truck,
        activeColor: 'bg-green-500 text-white',
        inactiveColor: 'bg-green-50 text-green-600'
    },
    restaurant_admin: {
        label: 'Restaurant Admin',
        icon: Building2,
        activeColor: 'bg-amber-500 text-white',
        inactiveColor: 'bg-amber-50 text-amber-600'
    },
    system_admin: {
        label: 'System Admin',
        icon: Shield,
        activeColor: 'bg-purple-500 text-white',
        inactiveColor: 'bg-purple-50 text-purple-600'
    }
};

const UserManagement = () => {
    const [selectedRoles, setSelectedRoles] = useState(['user']);
    const [users, setUsers] = useState(initialUsers);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [blockDuration, setBlockDuration] = useState('24h');
    const [newAdminUser, setNewAdminUser] = useState({
        name: '',
        email: '',
        role: 'restaurant_admin'
    });

    const handleFilterChange = (role) => {
        if (selectedRoles.includes(role)) {
            if (selectedRoles.length > 1) {
                setSelectedRoles(selectedRoles.filter((r) => r !== role));
            }
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteUser = () => {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setIsDetailsModalOpen(false);
    };

    const handleBlockUser = () => {
        console.log(`Blocking user ${selectedUser.name} for ${blockDuration}`);
        setIsDetailsModalOpen(false);
    };

    const handleAddAdmin = () => {
        const newUser = {
            ...newAdminUser,
            id: users.length + 1
        };
        setUsers([...users, newUser]);
        setIsAddAdminModalOpen(false);
        // Reset form
        setNewAdminUser({
            name: '',
            email: '',
            role: 'restaurant_admin'
        });
    };

    const filteredUsers = users.filter((user) =>
        selectedRoles.includes(user.role)
    );

    return (
        <div className="bg-white shadow-xl rounded-xl max-w-5xl mx-auto my-10 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
                <h2 className="text-3xl font-semibold text-gray-800">User Management</h2>
            </div>

            <button
                onClick={() => setIsAddAdminModalOpen(true)}
                className="fixed top-20 right-40 justify-center mt-5 mr-56 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
                <Plus className="mr-2" size={16} /> Add Admin
            </button>
            <div className="p-6">
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                            const Icon = config.icon;
                            const isSelected = selectedRoles.includes(role);

                            return (
                                <button
                                    key={role}
                                    onClick={() => handleFilterChange(role)}
                                    className={`
                                        flex items-center space-x-2 px-3 py-2 rounded-lg 
                                        transition-all duration-200 ease-in-out
                                        ${isSelected ? config.activeColor : config.inactiveColor}
                                        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50
                                    `}
                                >
                                    <Icon size={16} />
                                    <span className="text-sm font-medium">{config.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                {['ID', 'Name', 'Email', 'Role', 'Actions'].map((header) => (
                                    <th
                                        key={header}
                                        className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user) => {
                                const roleConfig = ROLE_CONFIG[user.role];
                                const Icon = roleConfig.icon;

                                return (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-4 text-sm text-gray-600">{user.id}</td>
                                        <td className="py-4 px-4 text-sm text-gray-800 font-medium">{user.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <Icon size={16} className={roleConfig.inactiveColor.split(' ')[1]} />
                                                <span className="text-sm text-gray-700">{roleConfig.label}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleUserSelect(user)}
                                                className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        <p>No users found with the selected filters.</p>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {isDetailsModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-semibold mb-4">User Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold">{selectedUser.name}</p>
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                <p className="text-sm text-gray-600">
                                    Role: {ROLE_CONFIG[selectedUser.role].label}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Block User</label>
                                <div className="flex space-x-2 items-center">
                                    <select
                                        value={blockDuration}
                                        onChange={(e) => setBlockDuration(e.target.value)}
                                        className="w-full px-2 py-1 border rounded-lg"
                                    >
                                        <option value="24h">24 Hours</option>
                                        <option value="72h">72 Hours</option>
                                        <option value="1w">1 Week</option>
                                        <option value="1m">1 Month</option>
                                        <option value="1y">1 Year</option>
                                    </select>
                                    <button
                                        onClick={handleBlockUser}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center"
                                    >
                                        <Ban className="mr-2" size={16} /> Block
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleDeleteUser}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <Trash2 className="mr-2" size={16} /> Delete Account
                                </button>
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="border px-4 py-2 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Admin Modal */}
            {isAddAdminModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    id="name"
                                    value={newAdminUser.name}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, name: e.target.value})}
                                    placeholder="Enter full name"
                                    className="mt-1 block w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={newAdminUser.email}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, email: e.target.value})}
                                    placeholder="Enter email address"
                                    className="mt-1 block w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Admin Role</label>
                                <select
                                    value={newAdminUser.role}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, role: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="restaurant_admin">Restaurant Admin</option>
                                    <option value="system_admin">System Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleAddAdmin}
                                    disabled={!newAdminUser.name || !newAdminUser.email}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                >
                                    Add Admin
                                </button>
                                <button
                                    onClick={() => setIsAddAdminModalOpen(false)}
                                    className="border px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;