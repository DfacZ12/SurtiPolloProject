import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso denegado</h1>
      <p className="text-gray-700 mb-6 text-lg">
        No tienes permisos para acceder a esta página.
      </p>
      <Link
        to="/Home"
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
