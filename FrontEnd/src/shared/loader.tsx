
export default function Loader({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-700">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute w-16 h-16 border-4 border-gray-300 rounded-full"></div>
        <div className="absolute w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
