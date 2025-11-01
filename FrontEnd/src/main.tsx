import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.tsx";
import HomePage from "./pages/Home.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import Loader from "./shared/loader.tsx";

const RootRedirect = () => {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) return <Loader message="Verificando sesión..." />;

  // Si está autenticado, lo mandamos a Home
  if (isAuth) {
    return <Navigate to="/Home" replace />;
  }

  // Si no está autenticado, mostramos Login
  return <Login />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/Home",
        element: <HomePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
