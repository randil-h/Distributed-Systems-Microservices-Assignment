import { motion } from "motion/react"
import MainContent from "../components/MainContent.js";

const Homepage = () => {
  return (
    <motion.div>
      <div className="w-screen">
        <MainContent/>
      </div>
    </motion.div>
  );
}

export default Homepage;
