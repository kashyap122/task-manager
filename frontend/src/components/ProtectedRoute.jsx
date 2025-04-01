import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
