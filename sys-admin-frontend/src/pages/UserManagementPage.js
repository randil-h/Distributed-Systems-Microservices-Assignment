import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import UserManagement from "../components/UserManagement";

const UserManagementPage = () => {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <Navbar/>
            <SideBar />
            <UserManagement/>
        </div>
    );
}

export default UserManagementPage;
