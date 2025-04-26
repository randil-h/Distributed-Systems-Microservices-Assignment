import React from 'react';
import { useNavigate } from "react-router-dom";
import {
    Home,
    Utensils,
    LogOut,
    Menu,
    X,
    PlusCircle,
    BookOpen, // Assuming you might want a book icon for menu
    Plus
} from 'lucide-react';

const RestaurantAdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, fetchRestaurants, handleLogout }) => {
    const navigate = useNavigate();
    const sidebarMenuItems = [
        {
            icon: <Home className="w-5 h-5 mr-3" />,
            label: 'Dashboard',
            onClick: () => navigate("/dashboard")
        },
        {
            icon: <Utensils className="w-5 h-5 mr-3" />,
            label: 'My Restaurants',
            onClick: () => navigate("/restaurants")
        },
        // {
        //     icon: <BookOpen className="w-5 h-5 mr-3" />,
        //     label: 'Current Menu Items',
        //     onClick: () => navigate("/menu-items") // You'll need to define this route
        // },
        // {
        //     icon: <Plus className="w-5 h-5 mr-3" />,
        //     label: 'Add Menu Item',
        //     onClick: () => navigate("/add-menu-item") // You'll need to define this route
        // },
        {
            icon: <PlusCircle className="w-5 h-5 mr-3" />,
            label: 'Add Restaurant',
            onClick: () => navigate("/register-restaurant")
        }
    ];

    return (
        <div className={`
            ${isSidebarOpen ? 'w-64' : 'w-20'}
            bg-white
            shadow-lg
            transition-all
            duration-300
            ease-in-out
            flex flex-col
        `}>
            <div className="flex items-center justify-between p-4 border-b">
                {isSidebarOpen && (
                    <h1 className="text-xl font-bold text-gray-800">
                        Restaurant Admin
                    </h1>
                )}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 flex flex-col mt-6">
                {sidebarMenuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className="
                            w-full
                            flex
                            items-center
                            px-4
                            py-3
                            text-gray-600
                            hover:bg-gray-100
                            hover:text-gray-900
                            transition-colors
                        "
                    >
                        {item.icon}
                        {isSidebarOpen && <span>{item.label}</span>}
                    </button>
                ))}

                <button
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        px-4
                        py-3
                        text-red-600
                        hover:bg-red-50
                        hover:text-red-800
                        mt-auto
                        transition-colors
                    "
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    {isSidebarOpen && 'Logout'}
                </button>
            </nav>
        </div>
    );
};

export default RestaurantAdminSidebar;