import SideBar from "../components/SideBar.jsx";
import Navbar from "../components/Navbar.jsx";
import RestaurantVerification from "../components/RestaurantVerification.jsx";

const RestaurantRegistrationsPage = () => {
    return (
        <div className="flex bg-gray-800 flex-col h-screen w-screen overflow-hidden">
            <Navbar/>
            <SideBar />
            <RestaurantVerification/>
        </div>
    );
}

export default RestaurantRegistrationsPage;
