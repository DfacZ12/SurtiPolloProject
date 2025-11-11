import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../auth/Consts";
import { useAuth } from "../../auth/AuthProvider";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Ieps } from "../../interfaces/IEps";
import type { Irole } from "../../interfaces/IRole";
import toast from "react-hot-toast";
import type { IUser } from "../../interfaces/IUsersList";
import Swal from "sweetalert2";

const UpdateProduct = ({ Id, onClose, onUpdated }: { Id: number, onClose: () => void, onUpdated: () => void }) => {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState<IUser[] | []>([]);
  const [epsData, setEpsData] = useState<Ieps[]>([]);
  const [rolData, setRolData] = useState<Irole[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    lname: "",
    cc: "",
    direccion: "",
    email: "",
    number: "",
    phone: "",
    eps: "",
    cargo: "",
  });

  const requiredFields = [
    "name",
    "lname",
    "cc",
    "direccion",
    "number",
    "email",
    "eps",
    "cargo",
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userInfo.length > 0) {
      const u: IUser = userInfo[0];
      setFormData({
        name: u?.Nombre || "",
        lname: u?.Apellido || "",
        cc: u?.cedula?.toString() || "",
        direccion: u?.Direccion || "",
        email: u?.Correo || "",
        number: u?.Celular || "",
        phone: u?.Tel_Fijo?.toString() || "",
        eps: epsData.find((e: Ieps) => e.Nombre === u.EPS)?.Id?.toString() || "",
        cargo: rolData.find((r: Irole) => r.Nombre === u.cargo)?.Id?.toString() || "",
      });
    }
  }, [userInfo, epsData, rolData]);

  const handleSelectUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/selectUser/${Id}`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 201) {
        setUserInfo(response.data.body);
      }
    } catch (e) {
      console.error("error al Traer la info del usuario.", e);
    }
  };
  const getEps = async () => {
    try {
      const response = await axios.get(`${API_URL}/selectEps`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 200) {
        setEpsData(response.data.body);
      }
    } catch {
      toast.error("error al Traer la info de las EPS.");
    }
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/selectRoles`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 200) {
        setRolData(response.data.body);
      }
    } catch {
      toast.error("error al Traer la info de los cargos ");
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpiar error cuando el usuario escribe
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "Campo obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (name: string) =>
    `bg-slate-100 focus:bg-transparent w-full text-sm text-slate-900 px-4 py-2.5 rounded-sm border transition-all outline-0 ${
      errors[name]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-blue-600"
    }`;

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.put(
        `${API_URL}/updateUser/${Id}`,
        formData,
        { headers: { Authorization: `Bearer ${auth.getAccessToken()}` } }
      );

      if (response.status === 201) {
        Swal.fire(response.data.body.message, "", "success");
        onClose();
        onUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire("Error al actualizar usuario", "", "error");
    }
  };

  useEffect(() => {
    handleSelectUser();
    getEps();
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <form
      onSubmit={handleSubmitUpdate}
      className="mx-auto bg-white [box-shadow:0_2px_13px_-6px_rgba(0,0,0,0.4)] xl:p-8 p-4 rounded-md"
    >
      <div className="grid md:grid-cols-2 gap-3">
        {/* Nombre */}
        <div>
          <label
            htmlFor="inptName"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Nombre *
          </label>
          <input
            id="inptName"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={inputClass("name")}
            placeholder="Ingresa el nombre"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label
            htmlFor="inptLastName"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Apellido *
          </label>
          <input
            id="inptLastName"
            name="lname"
            type="text"
            value={formData.lname}
            onChange={handleChange}
            className={inputClass("lname")}
            placeholder="Ingresa el apellido"
          />
          {errors.lname && (
            <p className="text-red-500 text-xs mt-1">{errors.lname}</p>
          )}
        </div>

        {/* Cédula */}
        <div>
          <label
            htmlFor="inptCC"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Cédula *
          </label>
          <input
            id="inptCC"
            name="cc"
            inputMode="numeric"
            maxLength={11}
            value={formData.cc}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            onChange={handleChange}
            className={inputClass("cedula")}
            placeholder="Ingresa número de cédula"
          />
          {errors.cc && (
            <p className="text-red-500 text-xs mt-1">{errors.cc}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label
            htmlFor="inptAddress"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Dirección
          </label>
          <input
            id="inptAddress"
            name="direccion"
            type="text"
            value={formData.direccion}
            onChange={handleChange}
            className={inputClass("direccion")}
            placeholder="Calle XXX"
          />
          {errors.direccion && (
            <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="inptEmail"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Correo electrónico *
          </label>
          <input
            id="inptEmail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass("email")}
            placeholder="nombre@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Celular */}
        <div>
          <label
            htmlFor="inptCel"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Celular
          </label>
          <input
            id="inptCel"
            name="number"
            type="text"
            maxLength={10}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            value={formData.number}
            onChange={handleChange}
            className={inputClass("number")}
            placeholder="321 XXXXXXX"
          />
          {errors.number && (
            <p className="text-red-500 text-xs mt-1">{errors.number}</p>
          )}
        </div>

        {/* Teléfono fijo */}
        <div>
          <label
            htmlFor="inptPhone"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Teléfono fijo
          </label>
          <input
            id="inptPhone"
            name="phone"
            inputMode="numeric"
            maxLength={8}
            value={formData.phone}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            onChange={handleChange}
            className={inputClass("phone")}
            placeholder="#######"
          />
        </div>

        {/* EPS */}
        <div>
          <label
            htmlFor="slcEps"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            EPS *
          </label>
          <select
            id="slcEps"
            name="eps"
            value={formData.eps}
            onChange={handleChange}
            className={inputClass("eps")}
          >
            <option value="">Seleccione una opción...</option>
            {epsData.map((eps: Ieps) => (
              <option key={eps.Id} value={eps.Id}>
                {eps.Nombre}
              </option>
            ))}
          </select>
          {errors.eps && (
            <p className="text-red-500 text-xs mt-1">{errors.eps}</p>
          )}
        </div>

        {/* Cargo */}
        <div>
          <label
            htmlFor="slcCargo"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Cargo *
          </label>
          <select
            id="slcCargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className={inputClass("cargo")}
          >
            <option value="">Seleccione un cargo...</option>
            {rolData.map((role: Irole) => (
              <option key={role.Id} value={role.Id}>
                {role.Nombre}
              </option>
            ))}
          </select>
          {errors.cargo && (
            <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full py-2.5 px-5 text-sm font-medium tracking-wider rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-0"
        >
          Actualizar Usuario
          <FontAwesomeIcon className="ml-2" icon={faUser} />
        </button>
      </div>
    </form>
  );
};

export default UpdateProduct;
