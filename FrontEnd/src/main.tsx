/* eslint-disable react-refresh/only-export-components */
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
import PortalLayout from "./layout/PortalLayout.tsx";
import CreateUsers from "./pages/Users/CreateUsers.tsx";
import ListUsers from "./pages/Users/ListUsers.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
import CreateProduct from "./pages/Products/CreateProduct.tsx";
import ListProducts from "./pages/Products/ListProduct.tsx";
import ListClients from "./pages/Clients/ListClients.tsx";
import CreateClient from "./pages/Clients/CreateClient.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import CreateSalesInvoice from "./pages/invoices/CreateSalesInvoice.tsx";
import ListSalesInvoice from "./pages/invoices/ListSalesInvoice.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";

const RootRedirect = () => {
  const { isAuth, isLoading, firstLogin } = useAuth();

  if (isLoading) return <Loader message="Verificando sesión..." />;

  if (isAuth) {
    if (firstLogin) return <Navigate to="/changePassword" replace />;
    return <Navigate to="/Home" replace />;
  }

  return <Login />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/changePassword",
        element: <ChangePassword />
      },
      {
        element: <PortalLayout />,
        children: [
          {
            path: "/Home",
            element: <HomePage />,
          },
          {
            element: <ProtectedRoute allowedRoles={["Administrador"]} />,
            children: [
              {
                path: "/Users",
                children: [
                  {
                    index: true,
                    element: <Navigate to="/Users/List" replace />,
                  },
                  {
                    path: "Create",
                    element: <CreateUsers />,
                  },
                  {
                    path: "List",
                    element: <ListUsers />,
                  },
                ],
              },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={["Administrador", "Almacenista"]} />
            ),
            children: [
              {
                path: "/Products",
                children: [
                  {
                    index: true,
                    element: <Navigate to="/Products/List" replace />,
                  },
                  {
                    path: "Create",
                    element: <CreateProduct />,
                  },
                  {
                    path: "List",
                    element: <ListProducts />,
                  },
                ],
              },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={["Administrador", "Cajero"]} />
            ),
            children: [
              {
                path: "/Clients",
                children: [
                  {
                    index: true,
                    element: <Navigate to="/Clients/List" replace />,
                  },
                  {
                    path: "Create",
                    element: <CreateClient />,
                  },
                  {
                    path: "List",
                    element: <ListClients />,
                  },
                ],
              },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={["Administrador", "Cajero"]} />
            ),
            children: [
              {
                path: "/SalesInvoice",
                children: [
                  {
                    index: true,
                    element: <Navigate to="/SalesInvoice/List" replace />,
                  },
                  {
                    path: "Create",
                    element: <CreateSalesInvoice />,
                  },
                  {
                    path: "List",
                    element: <ListSalesInvoice />,
                  },
                ],
              },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={["Administrador", "Almacenista"]} />
            ),
            children: [
              {
                path: "/SupplierInvoice",
                element: (
                  <p className="font-normal text-2xl text-red-600">
                    Pendiente en Construcción
                    <FontAwesomeIcon icon={faCog} />
                  </p>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  // <StrictMode>
  <AuthProvider>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{ duration: 5000 }}
    />
    <RouterProvider router={router} />
  </AuthProvider>
  // </StrictMode>
);
