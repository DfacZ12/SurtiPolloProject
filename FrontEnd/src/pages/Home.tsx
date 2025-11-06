import { useAuth } from "../auth/AuthProvider";

const HomePage = () => {
  const auth = useAuth();
  const name = auth.getUser()?.name;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-sm">
      <h1 className="text-3xl font-semibold text-gray-800">
        ¡Hola, <span className="text-green-600">{name}</span>! 👋
      </h1>
      <p className="text-gray-600 mt-3 max-w-lg">
        Bienvenido a tu panel de control. Usa el menú lateral para navegar entre
        las opciones disponibles.
      </p>

      <img
        src="https://illustrations.popsy.co/sky/product-launch.svg"
        alt="Dashboard"
        className="w-64 mt-8"
      />
    </div>
  );
};

export default HomePage;
