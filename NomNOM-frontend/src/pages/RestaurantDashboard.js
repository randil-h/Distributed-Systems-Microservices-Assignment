import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/utility_components/Navbar";

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <NavBar/>
      <div className="top-24 flex flex-col z-50 mt-32">
        <h2>Welcome to the Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

    </div>
  );
};

export default RestaurantDashboard;
