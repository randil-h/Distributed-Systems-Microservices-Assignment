import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../../api/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    const userRole = getRole();
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
