import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/Consts";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Token inválido",
      });
      navigate("/login");
    }
  }, [token]);

  const validatePassword = (password: string) => {
    const rules: string[] = [];
    if (password.length < 8) rules.push("Debe tener al menos 8 caracteres");
    if (!/[A-Z]/.test(password)) rules.push("Debe incluir una letra mayúscula");
    if (!/[a-z]/.test(password)) rules.push("Debe incluir una letra minúscula");
    if (!/\d/.test(password)) rules.push("Debe incluir un número");
    if (!/[!@#$%^&*()_\-+=<>?{}[\]~]/.test(password))rules.push("Debe incluir un carácter especial");
    setErrors(rules);
    return rules.length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) return;
    if (!password || !confirm)
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Completa ambos campos",
      });

    if (password !== confirm)
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/resetPassword`, {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "Tu contraseña ha sido actualizada correctamente",
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la contraseña",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Crear nueva contraseña</h2>

        <label className="block mb-2 text-sm font-medium">
          Nueva contraseña
        </label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />

        <label className="block mb-2 text-sm font-medium">
          Confirmar contraseña
        </label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            validatePassword(e.target.value);
          }}
        />

        {/* Mensajes de validación */}
        <ul className="text-sm text-gray-600 mb-4 space-y-1">
          {errors.map((err, idx) => (
            <li key={idx} className="flex items-center">
              <span className="text-red-500 mr-2">✗</span> {err}
            </li>
          ))}
          {errors.length === 0 && password.length > 0 && (
            <li className="flex items-center text-green-600">
              <span className="mr-2">✔</span> Contraseña segura
            </li>
          )}
        </ul>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Actualizando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
