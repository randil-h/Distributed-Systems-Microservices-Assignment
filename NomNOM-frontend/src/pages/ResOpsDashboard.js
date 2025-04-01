import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Users,
  Calendar,
  Clock,
  ClipboardList,
  LogOut,
  Menu,
  X
} from "lucide-react";

// Utility function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Create Sidebar Context
const SidebarContext = createContext(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const SidebarProvider = ({ children }) => {
  // Always keep sidebar open on desktop (true)
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const ResOpsDashboard = () => {
  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('authToken');

    // Clear any other auth data
    localStorage.removeItem('userData');

    // Redirect to login page
    window.location.href = '/login';

    console.log("Logging out...");
  };

  const sidebarMenuItems = [
    {
      icon: <Home size={20} />,
      label: 'Dashboard',
      href: '#'
    },
    {
      icon: <Users size={20} />,
      label: 'Staff Management',
      href: '#'
    },
    {
      icon: <Calendar size={20} />,
      label: 'Schedules',
      href: '#'
    },
    {
      icon: <Clock size={20} />,
      label: 'Shifts',
      href: '#'
    },
    {
      icon: <ClipboardList size={20} />,
      label: 'Inventory',
      href: '#'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <DesktopSidebar className="border-r border-gray-200">
          <SidebarHeader />
          <div className="mt-6 flex flex-col gap-1 px-2">
            {sidebarMenuItems.map((item, index) => (
              <SidebarLink key={index} link={item} />
            ))}
          </div>
          <div className="mt-auto mb-4 px-2">
            <SidebarLink
              link={{
                icon: <LogOut size={20} className="text-red-600" />,
                label: 'Logout',
                href: '#'
              }}
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-800"
            />
          </div>
        </DesktopSidebar>

        <MobileSidebar>
          <SidebarHeader />
          <div className="mt-6 flex flex-col gap-1 px-2">
            {sidebarMenuItems.map((item, index) => (
              <SidebarLink key={index} link={item} />
            ))}
          </div>
          <div className="mt-auto mb-4 px-2">
            <SidebarLink
              link={{
                icon: <LogOut size={20} className="text-red-600" />,
                label: 'Logout',
                href: '#'
              }}
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-800"
            />
          </div>
        </MobileSidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <MobileHeader />
          <div className="p-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Welcome to Restaurant Operations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-700">Staff Today</h3>
                  <p className="text-2xl text-blue-900">12/15</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-700">Inventory</h3>
                  <p className="text-2xl text-green-900">85%</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-bold text-amber-700">Upcoming Shifts</h3>
                  <p className="text-2xl text-amber-900">7</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-700">Revenue Today</h3>
                  <p className="text-2xl text-purple-900">$4,250</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

const SidebarHeader = () => {
  const { open, setOpen } = useSidebar();

  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-xl font-bold text-gray-800">
        Restaurant Ops
      </h1>
      {/* Mobile only toggle button - only appears on smaller screens */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700 md:hidden"
      >
        <X size={20} />
      </button>
    </div>
  );
};

const MobileHeader = () => {
  const { setOpen } = useSidebar();

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800">
        Restaurant Ops
      </h1>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
      >
        <Menu size={20} />
      </button>
    </div>
  );
};

const DesktopSidebar = ({ className, children }) => {
  return (
    <div
      className={cn(
        "h-full w-64 px-2 py-2 hidden md:flex md:flex-col bg-white shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
};

const MobileSidebar = ({ children }) => {
  const { open, setOpen } = useSidebar();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed h-full w-64 inset-y-0 left-0 bg-white p-2 z-50 flex flex-col md:hidden"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarLink = ({ link, className, onClick, ...props }) => {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-150",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {link.icon}
      <span className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre">
        {link.label}
      </span>
    </a>
  );
};

export default ResOpsDashboard;
