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
import {CartProvider} from "./context/CartContext";
import CartPage from "./pages/CartPage";

// Simple fade transition
const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <CartProvider>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...fadeTransition}>
              <Homepage/>
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...fadeTransition}>
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div {...fadeTransition}>
              <Signup />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div {...fadeTransition}>
              <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                <RestaurantDashboard />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/resops-dashboard"
          element={
            <motion.div {...fadeTransition}>
              <ProtectedRoute allowedRoles={["restaurant-staff"]}>
              <ResOpsDashboard />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/register-restaurant"
          element={
            <motion.div {...fadeTransition}>
              <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                <RestaurantRegister />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/restaurants"
          element={
            <motion.div {...fadeTransition}>
              <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                <RestaurantList />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/menu-items/:restaurantId"
          element={
            <motion.div {...fadeTransition}>
              <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                <MenuItemsPage />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/edit-menu-item/:id"
          element={
            <motion.div {...fadeTransition}>
              <ProtectedRoute allowedRoles={["restaurant-admin"]}>
                <MenuItemForm isEdit={true} />
              </ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/payment"
          element={
            <motion.div {...fadeTransition}>
              {/*<ProtectedRoute> uncomment when access control is properly implemented*/}
              <Payment />
              {/*</ProtectedRoute>*/}
            </motion.div>
          }
        />
        <Route
          path="/restaurant/:restaurantId"
          element={
            <motion.div {...fadeTransition}>
              {/* <ProtectedRoute> */}
              <Restaurant />
              {/* </ProtectedRoute> */}
            </motion.div>
          }
        />
      </Routes>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </CartProvider>
    </AnimatePresence>
  );
}

export default App;
