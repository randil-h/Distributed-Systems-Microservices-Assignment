"use client"

import { useState } from "react"
import { Bell, User } from "lucide-react"

const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const userName = localStorage.getItem("userName") || "Driver"

    const notifications = [
        { id: 1, text: "New delivery request received", time: "2 min ago" },
        { id: 2, text: "Your weekly summary is ready", time: "1 hour ago" },
        { id: 3, text: "Bonus opportunity available in your area", time: "3 hours ago" },
    ]

    return (
        <div className="flex items-center justify-between px-6 h-full border-b border-gray-700">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">
                    Nom Nom <span className="text-green-400">Riderz</span>
                </h1>

                <div className="hidden md:flex ml-8 space-x-1">
                    <button className="px-4 py-1 text-sm rounded-full bg-black text-white">Online</button>
                    <button className="px-4 py-1 text-sm rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                        Offline
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button
                        className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
                        onClick={() => {
                            setShowNotifications(!showNotifications)
                            setShowProfile(false)
                        }}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700">
                            <h3 className="px-4 py-2 text-sm font-semibold text-white border-b border-gray-700">Notifications</h3>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-700 border-b border-gray-700">
                                        <p className="text-sm text-white">{notification.text}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2 text-center">
                                <button className="text-xs text-green-400 hover:text-green-300">Mark all as read</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 text-gray-300"
                        onClick={() => {
                            setShowProfile(!showProfile)
                            setShowNotifications(false)
                        }}
                    >
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-300" />
                        </div>
                        <span className="hidden md:inline text-sm text-white">{userName}</span>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700">
                            <div className="px-4 py-2 border-b border-gray-700">
                                <p className="text-sm font-medium text-white">{userName}</p>
                                <p className="text-xs text-gray-400">Online</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Profile</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Settings</button>
                            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Help</button>
                            <div className="border-t border-gray-700 mt-1"></div>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
