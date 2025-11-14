import { useState } from "react";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../auth/AuthProvider";
import axios from "axios";
import { API_URL } from "../../auth/Consts";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateClient = () => {
  const auth = useAuth();
  const authUser = auth.getUser()?.username;
  const goTo = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lname: "",
    cedula: "",
    direccion: "",
    email: "",
    number: "",
    phone: "",
    registered_by: authUser
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const requiredFields = ["name", "lname", "cedula", "direccion" ,"number" ,"email"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    sendCreateUserData()
  };

  const inputClass = (name: string) =>
    `bg-slate-100 focus:bg-transparent w-full text-sm text-slate-900 px-4 py-2.5 rounded-sm border transition-all outline-0 ${
      errors[name] ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-600"
    }`;


  const sendCreateUserData = async ()=>{
    try {
      const response = await axios.post(`${API_URL}/createClient`, formData,
        { headers: { Authorization: `Bearer ${auth.getAccessToken()}` } }
      );
      if (response.status === 201) {
        const result = await Swal.fire({
          icon: "success",
          title: "Cliente creado correctamente",
          showConfirmButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#2563eb",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        if(result.isConfirmed){
          goTo("/Clients");
        }
      }
    } catch (error) {
     if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data.body.error || error.message);
      Swal.fire(error.response?.data.body.message || error.message, "", "error");
     }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto bg-white [box-shadow:0_2px_13px_-6px_rgba(0,0,0,0.4)] xl:p-8 p-4 rounded-md"
    >
      <div className="grid md:grid-cols-2 gap-3">
        {/* Nombre */}
        <div>
          <label htmlFor="inptName" className="text-slate-900 text-sm font-medium mb-2 block">
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
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="inptLastName" className="text-slate-900 text-sm font-medium mb-2 block">
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
          {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
        </div>

        {/* Cédula */}
        <div>
          <label htmlFor="inptCC" className="text-slate-900 text-sm font-medium mb-2 block">
            Cédula *
          </label>
          <input
            id="inptCC"
            name="cedula"
            inputMode="numeric"
            maxLength={11}
            value={formData.cedula}
            onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
            onChange={handleChange}
            className={inputClass("cedula")}
            placeholder="Ingresa número de cédula"
          />
          {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="inptAddress" className="text-slate-900 text-sm font-medium mb-2 block">
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
          {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="inptEmail" className="text-slate-900 text-sm font-medium mb-2 block">
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
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Celular */}
        <div>
          <label htmlFor="inptCel" className="text-slate-900 text-sm font-medium mb-2 block">
            Celular
          </label>
          <input
            id="inptCel"
            name="number"
            type="text"
            maxLength={10}
            onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
            value={formData.number}
            onChange={handleChange}
            className={inputClass("number")}
            placeholder="321 XXXXXXX"
          />
            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
        </div>

        {/* Teléfono fijo */}
        <div>
          <label htmlFor="inptPhone" className="text-slate-900 text-sm font-medium mb-2 block">
            Teléfono fijo
          </label>
          <input
            id="inptPhone"
            name="phone"
            inputMode="numeric"
            maxLength={8}
            value={formData.phone}
            onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
            onChange={handleChange}
            className={inputClass("phone")}
            placeholder="#######"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full py-2.5 px-5 text-sm font-medium tracking-wider rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-0"
        >
          Crear Cliente
          <FontAwesomeIcon className="ml-2" icon={faUserTag} />
        </button>
      </div>
    </form>
  );
};

export default CreateClient;
