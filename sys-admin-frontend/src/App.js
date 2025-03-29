import './index.css';
import {Route, Routes} from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import DashboardPage from "./pages/DashboardPage.js";
import RestaurantRegistrationsPage from "./pages/RestaurantRegistrationsPage";
import UserManagementPage from "./pages/UserManagementPage.js";
import { motion } from "motion/react"
import FinancesPage from "./pages/FinancesPage";


function App() {
  return (
      <motion.div>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
              <Route path="/users" element={<UserManagementPage/>}/>
              <Route path="/registrations" element={<RestaurantRegistrationsPage/>}/>
            <Route path="/finances" element={<FinancesPage/>}/>
          </Routes>
        </div>
      </motion.div>
  );
}

export default App;
