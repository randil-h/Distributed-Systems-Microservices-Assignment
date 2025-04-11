import SideBar from "../components/SideBar.jsx";
import Navbar from "../components/Navbar.jsx";
import UserManagement from "../components/UserManagement.jsx";

const UserManagementPage = () => {
    return (
        <div className="flex bg-gray-800 flex-col h-screen w-screen overflow-hidden">
            <Navbar/>
            <SideBar />
            <UserManagement/>
        </div>
    );
}

export default UserManagementPage;
