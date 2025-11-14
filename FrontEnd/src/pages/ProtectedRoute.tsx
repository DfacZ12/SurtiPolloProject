import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Loader from "../shared/loader";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useAuth();
  const location = useLocation();
  const user = auth.getUser();

  if (auth.isLoading) return <Loader message="Verificando sesión..." />;

  if (auth.firstLogin && location.pathname === "/changePassword") {
    return <Outlet />;
  }

  if (location.pathname === "/changePassword") {
    return <Navigate to="/Home" replace />;
  }

  if (!auth.isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
