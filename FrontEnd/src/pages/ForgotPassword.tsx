import axios from "axios";
import { useState } from "react";
import { API_URL } from "../auth/Consts";
import type { AuthResponseError } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/LogoFactura.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const goTo = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe ingresar un correo electrónico",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/forgotPassword`, {
        email,
      });
      if (response.status === 200) {
        const alert = await Swal.fire({
          icon: "success",
          title: "Correo enviado",
          text: "Se ha enviado un correo con el enlace para restablecer tu contraseña.",
        });
        if (alert.isConfirmed) {
          goTo("/");
        }
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error:",
          error.response?.data.body.error || error.message
        );
        const json = (await error.response?.data) as AuthResponseError;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: json.body.error || error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gradient-to-r from-[#f24464] to-[#F29C50] min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full border border-gray-300 p-8 rounded-xl bg-gray-200">
        <div className="text-center">
          <img
            src={logo}
            alt="Logo"
            className="inline-block w-[160px] h-[160px]"
          />
        </div>
        <h1 className="text-2xl font-semibold text-center text-black mt-8 mb-6">
          Recuperación de contraseña
        </h1>
        <p className="text-sm text-gray-600 text-center mt-8 mb-6">
          Introduce tu correo electrónico para restablecer tu contraseña
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm text-black font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              disabled={loading}
              id="email"
              name="email"
              placeholder="Introduce tu correo electrónico"
              className={`w-full text-sm text-slate-900 bg-white border-2 border-transparent focus:border-[#1E2772] pl-4 pr-8 py-2 rounded-md outline-none ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-40 mt-4 mb-4 py-2 mx-auto rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:bg-[#e06c06] focus:outline-none flex focus:ring-2 focus:ring-orange-500  items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? (
              <>
                <span className="flex flex-col justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 animate-[spin_0.8s_linear_infinite] fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
                      data-original="#000000"
                    />
                  </svg>
                </span>
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Volver a{" "}
            <Link
              to="/"
              className="text-sm font-medium text-[#1A2526] hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
