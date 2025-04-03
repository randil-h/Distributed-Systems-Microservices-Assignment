import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import Dashboard from "../components/resops_dashboard_components/Dashboard";
import StaffManagement from "../components/resops_dashboard_components/StaffManagement";
import Schedules from "../components/resops_dashboard_components/Schedules";
import Shifts from "../components/resops_dashboard_components/Shifts";
import Inventory from "../components/resops_dashboard_components/Inventory";

const cn = (...classes) => classes.filter(Boolean).join(" ");
const SidebarContext = createContext(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
  );
};

const ResOpsDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  const sidebarMenuItems = [
    { icon: <Home size={28} />, label: "Dashboard", component: <Dashboard /> },
    { icon: <Users size={28} />, label: "Staff Management", component: <StaffManagement /> },
    { icon: <Calendar size={28} />, label: "Schedules", component: <Schedules /> },
    { icon: <Clock size={28} />, label: "Shifts", component: <Shifts /> },
    { icon: <ClipboardList size={28} />, label: "Inventory", component: <Inventory /> },
  ];

  return (
    <SidebarProvider>
      <div className="flex text-2xl  h-screen bg-gray-50">
        <DesktopSidebar>
          <SidebarHeader />
          <div className="mt-6  flex flex-col gap-1 px-2">
            {sidebarMenuItems.map((item) => (
              <SidebarLink
                key={item.label}
                link={item}
                isActive={activeTab === item.label}
                onClick={() => setActiveTab(item.label)}
              />
            ))}
          </div>
          <div className="mt-auto mb-4 px-2">
            <SidebarLink
              link={{ icon: <LogOut size={20} className="text-red-600" />, label: "Logout" }}
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-800"
            />
          </div>
        </DesktopSidebar>

        <MobileSidebar>
          <SidebarHeader />
          <div className="mt-6 flex flex-col gap-1 px-2">
            {sidebarMenuItems.map((item) => (
              <SidebarLink
                key={item.label}
                link={item}
                isActive={activeTab === item.label}
                onClick={() => setActiveTab(item.label)}
              />
            ))}
          </div>
          <div className="mt-auto mb-4 px-2">
            <SidebarLink
              link={{ icon: <LogOut size={20} className="text-red-600" />, label: "Logout" }}
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 hover:text-red-800"
            />
          </div>
        </MobileSidebar>

        <div className="flex-1 overflow-y-auto ">
          <MobileHeader />
          {sidebarMenuItems.find((item) => item.label === activeTab)?.component}
        </div>
      </div>
    </SidebarProvider>
  );
};

const SidebarHeader = () => {
  const { open, setOpen } = useSidebar();
  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-4xl  ">ResOps_</h1>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-gray-100 text-gray-700 md:hidden">
        <X size={20} />
      </button>
    </div>
  );
};

const MobileHeader = () => {
  const { setOpen } = useSidebar();
  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
      <h1 className="text-4xl  ">ResOps</h1>
      <button onClick={() => setOpen(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
        <Menu size={20} />
      </button>
    </div>
  );
};

const SidebarLink = ({ link, isActive, onClick, className }) => {
  return (
    <button
      className={cn(
        "flex items-center text- justify-start gap-3 py-2 px-6 rounded-full text-gray-600 hover:bg-nomnom/90 hover:text-gray-300 transition duration-200",
        isActive ? "bg-nomnom text-light_hover" : "",
        className
      )}
      onClick={onClick}
    >

      <span className="text-lg whitespace-pre uppercase">{link.label}</span>
    </button>
  );
};

const DesktopSidebar = ({ children }) => {
  return <div className="h-full  w-72 px-2 py-2 hidden md:flex md:flex-col bg-white">{children}</div>;
};

const MobileSidebar = ({ children }) => {
  const { open, setOpen } = useSidebar();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div className="fixed h-full w-64 inset-y-0 left-0 bg-white p-2 z-50 flex flex-col md:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResOpsDashboard;
