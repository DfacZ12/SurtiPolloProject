import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../auth/Consts";
import { useAuth } from "../../auth/AuthProvider";
import { faDrumstickBite } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IProduct } from "../../interfaces/IProduct";
import Swal from "sweetalert2";

const UpdateProduct = ({ Id, onClose, onUpdated }: { Id: number | null, onClose: () => void, onUpdated: () => void }) => {
  const auth = useAuth();
  const [productInfo, setproductInfo] = useState<IProduct[] | []>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    quantity: 0,
    refrigeration_time: 0,
    iva: 0,
  });

  const requiredFields = [
    "name",
    "price",
    "quantity",
    "refrigeration_time",
    "iva",
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productInfo.length > 0) {
      const u: IProduct = productInfo[0];
      setFormData({
        name: u?.name || "",
        price: u?.price || 0,
        quantity: u?.quantity || 0,
        refrigeration_time: u?.refrigeration_time || 0,
        iva: u?.iva || 0,
      });
    }
  }, [productInfo]);

  const handleSelectProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/selectProduct/${Id}`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 201) {
        setproductInfo(response.data.body);
      }
    } catch (e) {
      console.error("error al Traer la info del usuario.", e);
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
        `${API_URL}/updateProduct/${Id}`,
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
    handleSelectProduct();
  }, []);


  return (
      <form
        onSubmit={handleSubmitUpdate}
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

          {/* Precio Unitario */}
          <div>
            <label htmlFor="inptPrice" className="text-slate-900 text-sm font-medium mb-2 block">
              Precio Unitario *
            </label>
            <input
              id="inptPrice"
              name="price"
              inputMode="numeric"
              value={formData.price}
              onChange={handleChange}
              onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
              className={inputClass("price")}
              placeholder="Ingresa el precio unitario"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Cantidad */}
          <div>
            <label htmlFor="inptQuantity" className="text-slate-900 text-sm font-medium mb-2 block">
              Cantidad *
            </label>
            <input
              id="inptQuantity"
              name="quantity"
              inputMode="numeric"
              maxLength={11}
              value={formData.quantity}
              onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
              onChange={handleChange}
              className={inputClass("quantity")}
              placeholder="Ingresa la cantidad"
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          {/* IVA */}
          <div>
            <label htmlFor="inptIva" className="text-slate-900 text-sm font-medium mb-2 block">
              IVA *
            </label>
            <input
              id="inptIva"
              name="iva"
              inputMode="numeric"
              value={formData.iva}
              onChange={handleChange}
              onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
              className={inputClass("iva")}
              placeholder="Ingresa el IVA"
            />
            {errors.iva && <p className="text-red-500 text-xs mt-1">{errors.iva}</p>}
          </div>
          {/* Tiempo de Refrigeración */}
          <div>
            <label htmlFor="inptRefrigerationTime" className="text-slate-900 text-sm font-medium mb-2 block">
              Tiempo de Refrigeración *
            </label>
            <input
              id="inptRefrigerationTime"
              name="refrigeration_time"
              inputMode="numeric"
              maxLength={11}
              value={formData.refrigeration_time}
              onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
              onChange={handleChange}
              className={inputClass("refrigeration_time")}
              placeholder="Ingresa el tiempo de refrigeración"
            />
            {errors.refrigeration_time && <p className="text-red-500 text-xs mt-1">{errors.refrigeration_time}</p>}
          </div>


        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full py-2.5 px-5 text-sm font-medium tracking-wider rounded-sm cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:outline-0"
          >
            Actualizar Producto
            <FontAwesomeIcon className="ml-2" icon={faDrumstickBite} />
          </button>
        </div>
      </form>
    );
};

export default UpdateProduct;
