"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Clock, CreditCard, Settings, HelpCircle, Star, MessageSquare, MapPin, BarChart } from "lucide-react"

export const Sidebar = () => {
    const location = useLocation()
    const [expanded, setExpanded] = useState(true)

    const linkClass = (path) =>
        `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors ${
            location.pathname === path ? "bg-black text-white" : "text-gray-300"
        }`

    const menuItems = [
        { path: "/dashboard", name: "Dashboard", icon: <Home className="w-5 h-5" /> },
        { path: "/order-history", name: "Order History", icon: <Clock className="w-5 h-5" /> },
        { path: "/earnings", name: "Earnings", icon: <CreditCard className="w-5 h-5" /> },
        { path: "/ratings", name: "Ratings", icon: <Star className="w-5 h-5" /> },
        { path: "/messages", name: "Messages", icon: <MessageSquare className="w-5 h-5" /> },
        { path: "/locations", name: "Saved Locations", icon: <MapPin className="w-5 h-5" /> },
        { path: "/statistics", name: "Statistics", icon: <BarChart className="w-5 h-5" /> },
        { path: "/settings", name: "Settings", icon: <Settings className="w-5 h-5" /> },
        { path: "/help", name: "Help & Support", icon: <HelpCircle className="w-5 h-5" /> },
    ]

    return (
        <div className="h-full flex flex-col bg-gray-800 text-white">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                    </div>
                    <span className="text-xl font-bold text-white">
            Nom Nom <span className="text-green-400">Riderz</span>
          </span>
                </div>

                <div className="bg-gray-700 p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{localStorage.getItem("userName")?.charAt(0) || "U"}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{localStorage.getItem("userName") || "Driver"}</p>
                            <div className="flex items-center">
                                <span className="text-xs text-gray-400">4.8</span>
                                <div className="flex ml-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3 h-3 ${star <= 4 ? "text-yellow-400" : "text-gray-600"}`}
                                            fill={star <= 4 ? "currentColor" : "none"}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                        {item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-gray-700">
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Current Version</p>
                    <p className="text-sm text-white">Nom Nom Riderz v2.1.0</p>
                </div>
            </div>
        </div>
    )
}
