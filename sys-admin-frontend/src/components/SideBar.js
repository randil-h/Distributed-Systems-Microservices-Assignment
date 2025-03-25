import { Link, useLocation } from "react-router-dom";

import {
    ArrowLeftStartOnRectangleIcon,
    HomeIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    Cog6ToothIcon,
    ExclamationCircleIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';

import { FaGun } from "react-icons/fa6";

import { useState } from "react";


export default function SideBar() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const isActive = (path) => {
        const currentPath = location.pathname.split('/')[1];
        return currentPath === path.split('/')[1];
    };

    const [currentWeekData, setCurrentWeekData] = useState({
        transactions: 0,
        income: 0,
        expense: 0,
        profitLoss: 0,
    });

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
        { name: "User Management", path: "/users", icon: UserGroupIcon },
        { name: "Restaurant Registrations", path: "/registrations", icon: ShieldCheckIcon },
        { name: "Financial Overview", path: "/finances", icon: BanknotesIcon, count: currentWeekData.transactions + 1 },
        { name: "Audit Logs", path: "/audit", icon: ShieldCheckIcon, comingSoon: true, disabled: true },
        { name: "Platform Settings", path: "/settings", icon: Cog6ToothIcon, comingSoon: true, disabled: true },
        { name: "Dispute Resolution", path: "/disputes", icon: FaGun, comingSoon: true, disabled: true },
        { name: "System Alerts", path: "/alerts", icon: ExclamationCircleIcon, comingSoon: true, disabled: true },
    ];

    const systemItems = [
        { name: "Logout", path: "/", icon: ArrowLeftStartOnRectangleIcon },
    ];

    return (
        <div className="bg-gray-100 bottom-0 top-12 fixed w-1/6 border-r flex flex-col justify-between divide-y divide-gray-300">
            {/* First ul */}
            <ul className="flex flex-col items-center text-gray-800 font-medium text-base py-4 px-3">
                {menuItems.map((item) => (
                    item.disabled ? (
                        <div key={item.name} className="w-full flex flex-row cursor-not-allowed opacity-50">
                            <li
                                className="flex flex-row w-full h-12 my-1 text-gray-500 px-1"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="pl-3 flex items-center">
                                        {item.icon && <item.icon className="mr-4 h-5 w-5 text-gray-400" />}
                                        {item.name}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="bg-yellow-300 text-black text-xs px-1 py-0.5 rounded ml-2">
                                            Coming Soon
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </div>
                    ) : (
                        <Link key={item.name} to={item.path} className="w-full flex flex-row">
                            <li
                                className={`flex flex-row w-full h-12 my-1 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 ${
                                    isActive(item.path) ? "bg-gray-200 text-lime-700 rounded-xl px-3 shadow-xl" : "hover:bg-gray-200 hover:rounded-xl hover:shadow-xl"
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="pl-3 flex items-center">
                                        {item.icon && <item.icon className="mr-4 h-5 w-5" />}
                                        {item.name}
                                    </div>
                                    {isActive(item.path) && item.count && (
                                        <span
                                            className="bg-red-400 rounded-full w-5 h-5 mr-2 flex items-center justify-center text-xs text-gray-100">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            </li>
                        </Link>
                    )
                ))}
            </ul>

            {/* Second ul */}
            <ul className="flex flex-row items-center gap-2 font-medium text-base py-4 px-4">
                {systemItems.map((item) => (
                    <Link key={item.name} to={item.path} className="w-full">
                        <li
                            className={`flex text-gray-700 w-full h-12 my-1 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 ${
                                isActive(item.path) ? "bg-gray-200 text-black rounded-xl px-3" : "hover:bg-red-100 hover:text-red-700 hover:shadow-xl hover:rounded-xl"
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="pl-3 flex items-center">
                                    {item.icon && <item.icon className="mr-4 h-5 w-5" />}
                                    {item.name}
                                </div>
                                {isActive(item.path) && item.count && (
                                    <span
                                        className="bg-gray-600 rounded-full w-5 h-5 mr-2 flex items-center justify-center text-xs text-gray-100">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}