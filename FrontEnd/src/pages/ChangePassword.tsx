import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import Swal from "sweetalert2";
import { API_URL } from "../auth/Consts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const auth = useAuth();
  const goTo = useNavigate();

  const validatePassword = (password: string, oldPass?: string) => {
    const rules: string[] = [];
    if (password.length < 8) rules.push("Debe tener al menos 8 caracteres");
    if (!/[A-Z]/.test(password)) rules.push("Debe incluir una letra mayúscula");
    if (!/[a-z]/.test(password)) rules.push("Debe incluir una letra minúscula");
    if (!/\d/.test(password)) rules.push("Debe incluir un número");
    if (!/[!@#$%^&*()_\-+=<>?{}[\]~]/.test(password))rules.push("Debe incluir un carácter especial");
    if(oldPass === password) rules.push("La contraseña actual y la nueva no pueden ser iguales");
    setErrors(rules);
    return rules.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent,) => {
    e.preventDefault();
    console.log(validatePassword(newPassword, oldPassword))
    if (!validatePassword(newPassword, oldPassword))return;
    try {
      const response = await axios.post(
        `${API_URL}/changePassword/${auth.getUser()?.username}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
        }
      );

      if (response.status === 200) {
        const result = await Swal.fire({
          icon: "success",
          title: "Contraseña cambiada correctamente, debes iniciar sesión nuevamente.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#2563eb",
        });
        if (result.isConfirmed) {
          logOutAction();
          goTo("/Home");
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al cambiar la contraseña",
        text: error.response?.data?.message || "Error al cambiar la contraseña",
      });
    }
  };

  const logOutAction = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/logOut`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.getRefreshToken()}` },
        }
      );
      if (response.status === 201) {
        auth.logOut();
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cerrar sesión",
        timer: 1500,
        showConfirmButton: false,
      });
      console.error("error al cerrar sesión", e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Cambiar contraseña
        </h2>

        <input
          type="password"
          placeholder="Contraseña actual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            validatePassword(e.target.value, oldPassword);
          }}
          className="w-full mb-3 p-2 border rounded-md"
        />

        {/* Mensajes de validación */}
        <ul className="text-sm text-gray-600 mb-4 space-y-1">
          {errors.map((err, idx) => (
            <li key={idx} className="flex items-center">
              <span className="text-red-500 mr-2">✗</span> {err}
            </li>
          ))}
          {errors.length === 0 && newPassword.length > 0 && (
            <li className="flex items-center text-green-600">
              <span className="mr-2">✔</span> Contraseña segura
            </li>
          )}
        </ul>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
