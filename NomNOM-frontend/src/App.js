import './App.css';
import { Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/auth_components/ProtectedRoute";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ResOpsDashboard from "./pages/ResOpsDashboard";
import { useEffect } from 'react';

function App() {
  const location = useLocation();

  // Prevent scrollbar flicker during transitions
  useEffect(() => {
    document.body.classList.add('no-scrollbar-shift');

    return () => {
      document.body.classList.remove('no-scrollbar-shift');
    };
  }, []);

  return (
    <div className="App overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Homepage />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <Signup />
              </PageTransition>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/resops-dashboard"
            element={
              <PageTransition>
                <ResOpsDashboard />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

// Ultra-smooth page transition component
const PageTransition = ({ children }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Refined animation variants with smoother transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99,
      y: 8
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for smoother motion
        opacity: { duration: 0.45 },
        scale: { duration: 0.6 },
        y: { duration: 0.45, ease: [0.33, 1, 0.68, 1] }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.99,
      y: -8,
      transition: {
        duration: 0.4,
        ease: [0.33, 0, 0.67, 0],
        opacity: { duration: 0.35 }
      }
    }
  };

  return (
    <motion.div
      className="page-content"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default App;

// import './App.css';
// import {Route, Routes} from "react-router-dom";
// import Homepage from "./pages/Homepage.js";
// import { motion } from "motion/react"
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ProtectedRoute from "./components/auth_components/ProtectedRoute";
// import RestaurantDashboard from "./pages/RestaurantDashboard";
//
//
// function App() {
//   return (
//     <motion.div>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Homepage/>}/>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["restaurant-admin"]}>
//                 <RestaurantDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>
//     </motion.div>
//
//   );
// }
//
// export default App;
