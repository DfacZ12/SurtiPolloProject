import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Loader from "../shared/loader";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useAuth()
  const location = useLocation()
  const user = auth.getUser();


  if (auth.isLoading) return <Loader message="Verificando sesión..." />;

  // Si no está autenticado → redirige al login
  if (!auth.isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si hay roles permitidos y el del usuario no está incluido → no autorizado
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }


  // Si todo bien → renderiza hijos
  return <Outlet />;
};

export default ProtectedRoute;
