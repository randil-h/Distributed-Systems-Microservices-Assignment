import SideBar from "../components/SideBar.jsx";
import Navbar from "../components/Navbar.jsx";
import TransactionWidget from "../components/TransactionWidget.jsx";
import {Link} from 'react-router-dom';

const Homepage = () => {

    return (
        <div className="flex bg-gray-800 flex-col h-screen w-screen overflow-hidden">
            <Navbar />
            <div className="flex">
                <SideBar />
                <div className="ml-96 mt-16 p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
                    <Link to="/finances">
                        <TransactionWidget/>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Homepage