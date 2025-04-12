import SideBar from "../components/SideBar.jsx";
import Navbar from "../components/Navbar.jsx";
import FinancialDashboard from "../components/FinanceDashboard.jsx";

const FinancesPage = () => {
    return (
        <div className="flex bg-gray-800 flex-col h-screen w-screen overflow-hidden">
            <Navbar/>
            <SideBar />
            <FinancialDashboard />
        </div>
    );
}

export default FinancesPage;
