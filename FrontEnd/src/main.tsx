import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.tsx";
import HomePage from "./pages/Home.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import Footer from "./layout/Footer.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
      <header></header>
      <RouterProvider router={router} />
      <footer className="fixed bottom-0 left-0 w-full bg-gray-100 p-4">
        {<Footer />}
      </footer>
    </AuthProvider>
  </StrictMode>
);
