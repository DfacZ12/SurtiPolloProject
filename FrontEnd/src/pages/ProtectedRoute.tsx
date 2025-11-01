import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Loader from "../shared/loader";

const ProtectedRoute=() => {
  const auth = useAuth();
  const isLoading = auth.isLoading;
  if (isLoading) return <Loader message="Verificando sesión..." />;
  return auth.isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;