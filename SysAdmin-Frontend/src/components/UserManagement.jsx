import React, { useState, useEffect } from 'react';
import { Users, Truck, Building2, Shield, Trash2, Ban, Plus, Coffee } from 'lucide-react';
import axios from 'axios';

const ROLE_CONFIG = {
    customer: {
        label: 'Customer',
        icon: Users,
        activeColor: 'bg-blue-500 text-white',
        inactiveColor: 'bg-blue-50 text-blue-600'
    },
    'delivery-personnel': {
        label: 'Delivery Personnel',
        icon: Truck,
        activeColor: 'bg-green-500 text-white',
        inactiveColor: 'bg-green-50 text-green-600'
    },
    'restaurant-admin': {
        label: 'Restaurant Admin',
        icon: Building2,
        activeColor: 'bg-amber-500 text-white',
        inactiveColor: 'bg-amber-50 text-amber-600'
    },
    'system-admin': {
        label: 'System Admin',
        icon: Shield,
        activeColor: 'bg-purple-500 text-white',
        inactiveColor: 'bg-purple-50 text-purple-600'
    },
    'restaurant-staff': {
        label: 'Restaurant Staff',
        icon: Coffee,
        activeColor: 'bg-red-500 text-white',
        inactiveColor: 'bg-red-50 text-red-600'
    }
};

const UserManagement = () => {
    const [selectedRoles, setSelectedRoles] = useState(['customer']);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [blockDuration, setBlockDuration] = useState('24h');
    const [newAdminUser, setNewAdminUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'restaurant-admin',
        address: ''
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:6969/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:6969/users/${selectedUser._id}`);
            setUsers(users.filter(u => u._id !== selectedUser._id));
            setIsDetailsModalOpen(false);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        }
    };

    const handleBlockUser = async () => {
        try {
            const now = new Date();
            let blockExpiry;

            // Calculate block expiry based on selected duration
            switch (blockDuration) {
                case '24h':
                    blockExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    break;
                case '72h':
                    blockExpiry = new Date(now.getTime() + 72 * 60 * 60 * 1000);
                    break;
                case '1w':
                    blockExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    break;
                case '1m':
                    blockExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                    break;
                case '1y':
                    blockExpiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    blockExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            }

            await axios.put(`http://localhost:6969/users/${selectedUser._id}`, {
                ...selectedUser,
                isBlocked: true,
                blockExpiry: blockExpiry.toISOString()
            });

            fetchUsers(); // Refresh user list
            setIsDetailsModalOpen(false);
        } catch (err) {
            console.error('Error blocking user:', err);
            alert('Failed to block user');
        }
    };

    const handleAddAdmin = async () => {
        try {
            const response = await axios.post('http://localhost:6969/users', newAdminUser);
            setUsers([...users, response.data]);
            setIsAddAdminModalOpen(false);
            // Reset form
            setNewAdminUser({
                name: '',
                email: '',
                password: '',
                role: 'restaurant-admin',
                address: ''
            });
        } catch (err) {
            console.error('Error adding admin:', err);
            alert('Failed to add admin user');
        }
    };

    const filteredUsers = users.filter((user) =>
        selectedRoles.includes(user.role)
    );

    if (loading) {
        return (
            <div className="bg-gray-900 shadow-xl rounded-xl max-w-5xl mx-auto my-10 p-6 text-center">
                <p className="text-gray-300">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 shadow-xl rounded-xl max-w-5xl mx-auto my-10 p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchUsers}
                    className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 shadow-xl rounded-xl max-w-5xl mx-auto my-10 overflow-hidden">
            <div className="p-6 bg-gray-800 border-b border-gray-700">
                <h2 className="text-3xl font-semibold text-gray-100">User Management</h2>
            </div>

            <button
                onClick={() => setIsAddAdminModalOpen(true)}
                className="fixed top-20 right-40 justify-center mt-5 mr-56 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
                <Plus className="mr-2" size={16} /> Add Admin
            </button>
            <div className="p-6">
                <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex flex-wrap gap-2">
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
                                ${isSelected ? config.activeColor : config.inactiveColor.replace('bg-gray-100', 'bg-gray-700').replace('text-gray-600', 'text-gray-300')}
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
                            <tr className="border-b border-gray-700">
                                {['ID', 'Name', 'Email', 'Role', 'Status', 'Actions'].map((header) => (
                                    <th
                                        key={header}
                                        className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user) => {
                                const roleConfig = ROLE_CONFIG[user.role];
                                const Icon = roleConfig ? roleConfig.icon : Users;
                                const isBlocked = user.isBlocked && new Date(user.blockExpiry) > new Date();

                                return (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        <td className="py-4 px-4 text-sm text-gray-300">{user._id.substring(0, 8)}...</td>
                                        <td className="py-4 px-4 text-sm text-gray-200 font-medium">{user.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-300">{user.email}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <Icon size={16} className={roleConfig ? roleConfig.inactiveColor.split(' ')[1] : ''} />
                                                <span className="text-sm text-gray-300">{roleConfig ? roleConfig.label : user.role}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                isBlocked ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
                                            }`}>
                                                {isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleUserSelect(user)}
                                                className="px-3 py-1 border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-200"
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
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-100">User Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-gray-100">{selectedUser.name}</p>
                                <p className="text-sm text-gray-400">{selectedUser.email}</p>
                                <p className="text-sm text-gray-300">
                                    Role: {ROLE_CONFIG[selectedUser.role]?.label || selectedUser.role}
                                </p>
                                {selectedUser.address && (
                                    <p className="text-sm text-gray-300">Address: {selectedUser.address}</p>
                                )}
                                {selectedUser.location && (
                                    <p className="text-sm text-gray-300">Location: {selectedUser.location}</p>
                                )}
                                {selectedUser.restaurantId && (
                                    <p className="text-sm text-gray-300">Restaurant ID: {selectedUser.restaurantId}</p>
                                )}
                                <p className="text-sm text-gray-300 mt-2">
                                    Status: {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                                    {selectedUser.isBlocked && selectedUser.blockExpiry && (
                                        <span> until {new Date(selectedUser.blockExpiry).toLocaleString()}</span>
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Block User</label>
                                <div className="flex space-x-2 items-center">
                                    <select
                                        value={blockDuration}
                                        onChange={(e) => setBlockDuration(e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                    >
                                        <option value="24h">24 Hours</option>
                                        <option value="72h">72 Hours</option>
                                        <option value="1w">1 Week</option>
                                        <option value="1m">1 Month</option>
                                        <option value="1y">1 Year</option>
                                    </select>
                                    <button
                                        onClick={handleBlockUser}
                                        className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center"
                                    >
                                        <Ban className="mr-2" size={16} /> Block
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleDeleteUser}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <Trash2 className="mr-2" size={16} /> Delete Account
                                </button>
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="border border-gray-600 px-4 py-2 rounded-lg text-gray-200"
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
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-100">Add New Admin</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                                <input
                                    id="name"
                                    value={newAdminUser.name}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, name: e.target.value})}
                                    placeholder="Enter full name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={newAdminUser.email}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, email: e.target.value})}
                                    placeholder="Enter email address"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={newAdminUser.password}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, password: e.target.value})}
                                    placeholder="Enter password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
                                <input
                                    id="address"
                                    value={newAdminUser.address}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, address: e.target.value})}
                                    placeholder="Enter address (optional)"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Admin Role</label>
                                <select
                                    value={newAdminUser.role}
                                    onChange={(e) => setNewAdminUser({...newAdminUser, role: e.target.value})}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                >
                                    <option value="restaurant-admin">Restaurant Admin</option>
                                    <option value="system-admin">System Admin</option>
                                    <option value="restaurant-staff">Restaurant Staff</option>
                                </select>
                            </div>
                            {newAdminUser.role === 'restaurant-staff' && (
                                <div>
                                    <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-300">Restaurant ID</label>
                                    <input
                                        id="restaurantId"
                                        value={newAdminUser.restaurantId || ''}
                                        onChange={(e) => setNewAdminUser({...newAdminUser, restaurantId: e.target.value})}
                                        placeholder="Enter restaurant ID"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleAddAdmin}
                                    disabled={!newAdminUser.name || !newAdminUser.email || !newAdminUser.password || (newAdminUser.role === 'restaurant-staff' && !newAdminUser.restaurantId)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                >
                                    Add Admin
                                </button>
                                <button
                                    onClick={() => setIsAddAdminModalOpen(false)}
                                    className="border border-gray-600 px-4 py-2 rounded-lg text-gray-200"
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