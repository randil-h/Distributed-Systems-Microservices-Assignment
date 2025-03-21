import './App.css';
import {Route, Routes} from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import EmployeesPage from "./pages/EmployeesPage.js";
import { motion } from "motion/react"
import CropsPage from "./pages/CropsPage.js";

function App() {
  return (
    <motion.div>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/employees" element={<EmployeesPage/>}/>
          <Route path="/crops" element={<CropsPage/>}/>
        </Routes>
      </div>
    </motion.div>

  );
}

export default App;
