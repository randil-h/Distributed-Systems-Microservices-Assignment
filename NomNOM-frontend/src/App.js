import React from 'react';
import './App.css';
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Homepage from "./pages/Homepage.js";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/auth_components/ProtectedRoute";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ResOpsDashboard from "./pages/ResOpsDashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import RestaurantList from "./pages/RestaurantList";
import MenuItemsPage from "./pages/MenuItemsPage";
import MenuItemForm from "./components/admin_components/MenuItemForm";
import Payment from "./pages/Payment";
import Restaurant from "./pages/Restaurant";

// Page transition configuration
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  },
  out: {
    opacity: 0,
    y: -50
  }
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 50
  },
  in: {
    opacity: 1,
    y: 0
  }
};

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <motion.div variants={childVariants}>
                <Homepage/>
              </motion.div>
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <motion.div variants={childVariants}>
                <Login />
              </motion.div>
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <motion.div variants={childVariants}>
                <Signup />
              </motion.div>
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <motion.div variants={childVariants}>
                <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                  <RestaurantDashboard />
                </ProtectedRoute>
              </motion.div>
            </motion.div>
          }
        />
        <Route
          path="/resops-dashboard"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <motion.div variants={childVariants}>
                {/*<ProtectedRoute allowedRoles={["restaurant-staff"]}>*/}
                  <ResOpsDashboard />
                {/*</ProtectedRoute>*/}
              </motion.div>
            </motion.div>
          }
        />
          <Route
              path="/register-restaurant"
              element={
                  <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                  >
                      <motion.div variants={childVariants}>
                          <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                              <RestaurantRegister />
                          </ProtectedRoute>
                      </motion.div>
                  </motion.div>
              }
          />
          <Route
              path="/restaurants"
              element={
                  <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                  >
                      <motion.div variants={childVariants}>
                          <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                              <RestaurantList />
                          </ProtectedRoute>
                      </motion.div>
                  </motion.div>
              }
          />
          <Route
              path="/menu-items/:restaurantId"
              element={
                  <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                  >
                      <motion.div variants={childVariants}>
                          <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                              <MenuItemsPage />
                          </ProtectedRoute>
                      </motion.div>
                  </motion.div>
              }
          />
          <Route
              path="/edit-menu-item/:id"
              element={
                  <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                  >
                      <motion.div variants={childVariants}>
                          <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                              <MenuItemForm isEdit={true} />
                          </ProtectedRoute>
                      </motion.div>
                  </motion.div>
              }
          />
          <Route
              path="/payment"
              element={
                  <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                  >
                      <motion.div variants={childVariants}>
                          {/*<ProtectedRoute> uncomment when access control is properly implemented*/}
                          <Payment />
                          {/*</ProtectedRoute>*/}
                      </motion.div>
                  </motion.div>
              }
          />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
            >
              <motion.div variants={childVariants}>
                {/* <ProtectedRoute> */}
                <Restaurant />
                {/* </ProtectedRoute> */}
              </motion.div>
            </motion.div>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}

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
