import axios from "axios";
import { useState } from "react";
import { API_URL } from "../auth/Consts";
import type { AuthResponse, AuthResponseError } from "../interfaces/types";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../shared/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const goTo = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/forgotPassword`, {
        email,
      });
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Correo enviado",
          text: "Se ha enviado un correo con el enlace para restablecer tu contraseña.",
        });
        goTo("/login");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error:",
          error.response?.data.body.error || error.message
        );
        const json = (await error.response?.data) as AuthResponseError;
        setErrorResponse(json.body.error || error.message);
      }
    }
  };
  return (
    <div className="bg-gradient-to-r from-[#f24464] to-[#F29C50] min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full border border-gray-300 p-8 rounded-xl bg-gray-200">
        <div className="text-center">
          <img
              src="/LogoFactura.png"
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
            <label htmlFor="email" className="block mb-2 text-sm text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
               className="w-full text-sm text-slate-900 bg-white border-2 border-transparent focus:border-[#1E2772] pl-4 pr-8 py-2 rounded-md outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
          type="submit"
          className="w-32 mt-4 mb-4 py-2 mx-auto rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:bg-[#e06c06] focus:outline-none block focus:ring-2 focus:ring-orange-500 cursor-pointer">
                Enviar
              </button>
              {!!errorResponse && (
                <Alert title={"Error!"} message={errorResponse} type={"error"} />
              )}
        </form>
        <div className="text-center">
          <p className="text-sm">
            Volver a{" "}
            <Link to="/" className="text-sm font-medium text-[#1A2526] hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
