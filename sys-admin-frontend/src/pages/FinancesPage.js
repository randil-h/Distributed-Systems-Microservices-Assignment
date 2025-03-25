import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

const FinancesPage = () => {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <Navbar/>
            <SideBar />
        </div>
    );
}

export default FinancesPage;
