import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

const Homepage = () => {
    return (
        <div className="flex bg-gray-800 flex-col h-screen w-screen overflow-hidden">
            <Navbar/>
            <SideBar />
        </div>
    );
}

export default Homepage;
