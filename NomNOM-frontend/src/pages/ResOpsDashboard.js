import React, { useState } from 'react';
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  Clock,
  ClipboardList,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const ResOpsDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarMenuItems = [
    {
      icon: <Home className="mr-3" />,
      label: 'Dashboard',
      onClick: () => {}
    },
    {
      icon: <Users className="mr-3" />,
      label: 'Staff Management',
      onClick: () => {}
    },
    {
      icon: <Calendar className="mr-3" />,
      label: 'Schedules',
      onClick: () => {}
    },
    {
      icon: <Clock className="mr-3" />,
      label: 'Shifts',
      onClick: () => {}
    },
    {
      icon: <ClipboardList className="mr-3" />,
      label: 'Inventory',
      onClick: () => {}
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white 
        shadow-lg 
        transition-all 
        duration-300 
        ease-in-out
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">
              Restaurant Ops
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="mt-6">
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
            "
          >
            <LogOut className="mr-3" />
            {isSidebarOpen && 'Logout'}
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Restaurant Operations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800">Staff Today</h3>
              <p className="text-2xl">12/15</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800">Inventory</h3>
              <p className="text-2xl">85%</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800">Upcoming Shifts</h3>
              <p className="text-2xl">7</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-800">Revenue Today</h3>
              <p className="text-2xl">$4,250</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResOpsDashboard;
