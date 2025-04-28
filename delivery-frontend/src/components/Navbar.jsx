import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow p-4 flex justify-between">
            <div className="text-xl font-bold">Rider Dashboard</div>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
