import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
 
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
 
  if (loading) return null; // wait for localStorage to load — don't redirect yet
 
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
 
  return children;
}