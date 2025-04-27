import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation(); // To track the current route for active state

    return (
        <div className="fixed left-0 top-0 w-64 h-full bg-white border-r shadow-md flex flex-col p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-indigo-600">Menu</h2>
            <nav className="flex flex-col space-y-4">
                <Link
                    to="/dashboard"
                    className={`${
                        location.pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                    } hover:bg-indigo-100 hover:text-indigo-600 p-3 rounded-lg transition-all`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/order-history"
                    className={`${
                        location.pathname === '/order-history' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                    } hover:bg-indigo-100 hover:text-indigo-600 p-3 rounded-lg transition-all`}
                >
                    Order History
                </Link>
                <Link
                    to="/profile"
                    className={`${
                        location.pathname === '/profile' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                    } hover:bg-indigo-100 hover:text-indigo-600 p-3 rounded-lg transition-all`}
                >
                    Profile
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
