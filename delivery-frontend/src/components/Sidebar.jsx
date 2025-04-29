import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
    const location = useLocation();

    const linkClass = (path) =>
        `block px-6 py-3 text-lg font-medium rounded-md hover:bg-indigo-100 ${
            location.pathname === path ? 'bg-indigo-200 font-bold' : ''
        }`;

    return (
        <div className="h-full p-6 flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">Menu</h2>
            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            <Link to="/order-history" className={linkClass('/order-history')}>Order History</Link>
        </div>
    );
};
