import './App.css';
import {Route, Routes} from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import { motion } from "motion/react"


function App() {
  return (
    <motion.div>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage/>}/>
        </Routes>
      </div>
    </motion.div>

  );
}

export default App;
