import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Loader from "../shared/loader";

export default function ProtectedRoute() {
  const auth = useAuth();
  const isLoading = auth.isLoading;
  if (isLoading) return <Loader message="Verificando sesión..." />;
  return auth.isAuth ? <Outlet /> : <Navigate to="/" />;
}
