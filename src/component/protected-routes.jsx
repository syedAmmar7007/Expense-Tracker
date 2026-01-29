import { Navigate } from "react-router-dom";
import { useAuth } from "../store/expense-tracker-context";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
