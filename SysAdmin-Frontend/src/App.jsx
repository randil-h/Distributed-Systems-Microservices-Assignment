import './index.css';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RestaurantRegistrationsPage from './pages/RestaurantRegistrationsPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import FinancesPage from './pages/FinancesPage.jsx';
import { motion } from 'framer-motion';

function App() {
    return (
        <motion.div className="App">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/registrations" element={<RestaurantRegistrationsPage />} />
                <Route path="/finances" element={<FinancesPage />} />
            </Routes>
        </motion.div>
    );
}

export default App;