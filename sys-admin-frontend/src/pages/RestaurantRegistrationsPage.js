import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import RestaurantVerification from "../components/RestaurantVerification";

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
