import { motion } from "framer-motion";
import SideBar from "../components/SideBar.jsx";
import Navbar from "../components/Navbar.jsx";
import TransactionWidget from "../components/TransactionWidget.jsx";
import { Link } from 'react-router-dom';
import TopRestaurantWidget from "../components/TopRestaurantWidget.jsx";

const Homepage = () => {
    return (
        <div className="flex bg-gray-800 flex-col h-screen w-screen overflow-hidden">
            {/* Animated Navbar */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Navbar />
            </motion.div>

            <div className="flex">
                {/* Animated Sidebar */}
                <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <SideBar />
                </motion.div>

                {/* Animated Main Content */}
                <motion.div
                    className="ml-96 mt-16 p-6 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-wrap gap-6">
                        {/* Animated Transaction Widget */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 min-w-[300px]"
                        >
                            <Link to="/finances">
                                <TransactionWidget />
                            </Link>
                        </motion.div>

                        {/* Animated Top Restaurant Widget */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 min-w-[300px]"
                        >
                            <Link to="/finances">
                                <TopRestaurantWidget />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Homepage;