import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faFileInvoiceDollar,
  faPlus,
  faSave,
  faTrash,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../auth/Consts.ts";
import { useAuth } from "../../auth/AuthProvider";
import type { IClient } from "../../interfaces/IClient";
import type { IProduct } from "../../interfaces/IProduct";
import type { IInvoice } from "../../interfaces/IInvoice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { generatePDF } from "../../util/InvoiceResultActions.tsx";

const SalesInvoice = () => {
  const auth = useAuth();
  const authUser = auth.getUser()?.username;
  const goTo = useNavigate();
  const [cliente, setCliente] = useState<IClient | null>(null);
  const [clientesCache, setClientesCache] = useState<Record<string, IClient>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productos, setProductos] = useState<IProduct[]>([]);
  const [ProductList, setProductList] = useState<IProduct[]>([]);
  const [producto, setProducto] = useState<string>("");
  const [idProducto, setIdProducto] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [precio, setPrecio] = useState<number>(0);
  const [totalFactura, setTotalFactura] = useState<number>(0);
  const [totalIva, setTotalIva] = useState<number>(0);
  const [totalSinIva, setTotalSinIva] = useState<number>(0);
  const [ivaPr, setIvaPr] = useState<number>(0);
  const [formData, setFormData] = useState({ cedula: "" });

  const requiredFields = ["cedula"];

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (formData.cedula.trim().length < 5) return; // evita buscar si es muy corta

    const timeout = setTimeout(async () => {
      // Si ya está en cache, úsalo
      if (clientesCache[formData.cedula]) {
        setCliente(clientesCache[formData.cedula]);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/selectClient/${formData.cedula}`,
          {
            headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
          }
        );
        if (!(response.status === 201 && response.data.body)) {
          setCliente(null);
          toast.error("Cliente no encontrado");
          return;
        }
        const client = response.data.body as IClient[];
        setCliente(client[0]);
        setClientesCache((prev) => ({ ...prev, [formData.cedula]: client[0] }));
      } catch (error) {
        setCliente(null);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.body.error);
          return;
        }
        toast.error("Error al obtener datos del cliente");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.cedula]);

  //Agregar producto a la factura
  const agregarProducto = (event: React.FormEvent): void => {
    event.preventDefault();

    if (!producto || precio <= 0 || cantidad <= 0) {
      Swal.fire("Error", "Completa todos los campos del producto", "error");
      return;
    }

    const productoSeleccionado = ProductList.find((p) => p.name === producto);

    if (!productoSeleccionado) {
      Swal.fire("Error", "El producto seleccionado no existe", "error");
      return;
    }
    const subtotal = precio * cantidad;
    const iva = subtotal * (ivaPr / 100);
    const totalLinea = subtotal + iva;

    // actualizar o agregar producto
    setProductos((prev) => {
      const existente = prev.find((p) => p.name === producto);

      let nuevosProductos;
      if (existente) {
        // Si ya existe, se actualiza la cantidad, iva y total
        nuevosProductos = prev.map((p) =>
          p.name === producto
            ? {
                ...p,
                quantity: (p.quantity ?? 0) + cantidad,
                iva: (p.iva ?? 0) + iva,
                totalLinea: (p.totalLinea ?? 0) + totalLinea,
              }
            : p
        );
      } else {
        // Si es nuevo, se agrega al array
        nuevosProductos = [
          ...prev,
          {
            Id: idProducto,
            name: producto,
            quantity: cantidad,
            price: precio,
            iva,
            totalLinea,
          },
        ];
      }

      recalcularTotales(nuevosProductos);
      return nuevosProductos;
    });

    // actualizar stock en lista de productos
    setProductList((prev) =>
      prev.map((p) =>
        p.name === producto
          ? { ...p, quantity: (p.quantity ?? 0) - cantidad }
          : p
      )
    );

    // limpiar campos
    setProducto("");
    setCantidad(1);
    setPrecio(0);
    setIvaPr(0);
  };

  //Traer productos
  const getProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/listProducts`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 200) {
        setProductList(response.data.body);
      }
    } catch {
      toast.error("error al Traer la info de los productos ");
    }
  };

  //Recalcular totales
  const recalcularTotales = (prods: IProduct[]): void => {
    const subtotal = prods.reduce(
      (acc, p) => acc + (p.price ?? 0) * (p.quantity ?? 0),
      0
    );
    const ivaTotal = prods.reduce((acc, p) => acc + (p.iva ?? 0), 0);
    const totalSinIva = subtotal;
    setTotalFactura(subtotal + ivaTotal);
    setTotalIva(ivaTotal);
    setTotalSinIva(totalSinIva);
  };

  // Guardar factura
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;
    const nameC = `${cliente?.name || ""} ${cliente?.lname || ""}`;
    const payload = {
      factura: {
        cedula: Number(formData.cedula),
        name: nameC,
        total_factura: totalFactura,
        iva_total: totalIva,
        registered_by: authUser,
      },
      detalles: productos.map((p) => ({
        id_producto: Number(p.Id),
        nombre_producto: p.name,
        cantidad: p.quantity,
        precio_unitario: p.price,
        iva: p.iva,
      })),
    };
    await sendCreateInvoice(payload);
  };

  const sendCreateInvoice = async (data: IInvoice) => {
    try {
      const response = await axios.post(`${API_URL}/createInvoice`, data, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      const facturaCompleta = {
        factura: { ...data.factura, facturaId: response.data.body.facturaId },
        detalle: [ ...data.detalles]
      };
      if (response.status === 201) {
        const result = await Swal.fire({
          icon: "success",
          title: "Factura Registrada correctamente",
          showConfirmButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#2563eb",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        if (result.isConfirmed) {
          generatePDF(facturaCompleta);
          goTo("/SalesInvoice");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error:",
          error.response?.data.body.error || error.message
        );
        Swal.fire(
          error.response?.data.body.error || error.message,
          "",
          "error"
        );
      }
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
    if (cliente === null && formData.cedula) {
      Swal.fire(
        "Error",
        "El Cliente debe estar registrado en el sistema.",
        "error"
      );
      return false;
    }
    if (productos.length === 0 && formData.cedula) {
      Swal.fire("Error", "Debe agregar al menos un producto", "error");
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (name?: string) => {
    const baseClasses =
      "bg-slate-100 focus:bg-transparent text-sm text-slate-900 px-4 py-2.5 rounded-sm border transition-all outline-0";

    if (!name) {
      return `${baseClasses} border-gray-200 focus:border-blue-600`;
    }

    return `${baseClasses} ${
      errors[name]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-200 focus:border-blue-600"
    }`;
  };

  const numberMiles = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const eliminarProducto = (index: number): void => {
    const productoEliminado = productos[index];

    if (!productoEliminado) return;

    // devolver stock al inventario
    setProductList((prev) =>
      prev.map((p) =>
        p.name === productoEliminado.name
          ? {
              ...p,
              quantity: (p.quantity ?? 0) + (productoEliminado.quantity ?? 0),
            }
          : p
      )
    );

    // quitar producto de la factura
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    recalcularTotales(nuevosProductos);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto bg-white [box-shadow:0_2px_13px_-6px_rgba(0,0,0,0.4)] xl:p-8 p-6 rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4">
        <FontAwesomeIcon className="mr-1" icon={faFileInvoiceDollar} />
        Registro de Factura
      </h1>

      {/* Cliente */}
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-3">
        <div className="w-full">
          <ul className="w-full max-w-full overflow-hidden text-sm font-medium mt-4  bg-white border border-t-blue-800 border-gray-200 rounded-lg">
            <li className="w-full px-4 py-2 border-b border-blue-800 rounded-t-lg bg-blue-800 text-white">
              <FontAwesomeIcon className="mr-2" icon={faUserTag} />
              Datos del Cliente
            </li>
            <li className="w-full px-4 py-2 border-b border-gray-200">
              <b>Nombre:</b>{" "}
              <span className="text-gray-600">{cliente?.name || "—"}</span>
            </li>
            <li className="w-full px-4 py-2 border-b border-gray-200">
              <b>Apellido:</b>{" "}
              <span className="text-gray-600">{cliente?.lname || "—"}</span>
            </li>
            <li className="w-full px-4 py-2 border-b border-gray-200">
              <b>Cédula:</b>{" "}
              <span className="text-gray-600">{cliente?.cedula || "—"}</span>
            </li>
            <li className="w-full px-4 py-2 border-b border-gray-200">
              <b>Dirección:</b>{" "}
              <span className="text-gray-600">{cliente?.Direccion || "—"}</span>
            </li>
            {cliente?.Tel_Fijo && (
              <li className="w-full px-4 py-2 border-b border-gray-200">
                <b>Teléfono:</b>{" "}
                <span className="text-gray-600">
                  {cliente?.Tel_Fijo || "—"}
                </span>
              </li>
            )}
            <li className="w-full px-4 py-2 border-b border-gray-200">
              <b>Celular:</b>{" "}
              <span className="text-gray-600">{cliente?.Celular || "—"}</span>
            </li>
            <li className="w-full px-4 py-2 border-b border-gray-200">
              <b>Email:</b>{" "}
              <span className="text-gray-600">{cliente?.Correo || "—"}</span>
            </li>
          </ul>
        </div>

        <div className="w-full">
          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">
              Cédula *
            </label>
            <input
              id="inptCC"
              name="cedula"
              inputMode="numeric"
              maxLength={11}
              value={formData.cedula}
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                ))
              }
              onChange={handleChange}
              className={`${inputClass("cedula")} w-full`}
              placeholder="Ingresa número de cédula"
            />
            {errors.cedula && (
              <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>
            )}
          </div>
          <div className={`mt-6 ${!cliente ? "opacity-50" : ""}`}>
            <div>
              <label className="block text-sm">Producto</label>
              <select
                value={producto}
                onChange={(e) => {
                  const product = ProductList.find(
                    (p) => p.name === e.target.value
                  );
                  if (product) {
                    setIdProducto(product.Id || 0);
                    setProducto(product.name || "");
                    setPrecio(product.price || 0);
                    setIvaPr(product.iva || 0);
                  }
                }}
                className={`form-select`}
                disabled={!cliente}
              >
                <option value="">Selecciona un producto</option>
                {ProductList.map((product: IProduct, index) => (
                  <option
                    key={index}
                    value={product.name}
                    disabled={(product.quantity ?? 0) <= 0}
                  >
                    {product.name}{" "}
                    {product.quantity && product.quantity <= 0
                      ? "(Sin stock)"
                      : `(${product.quantity} disponibles)`}
                  </option>
                ))}
              </select>
              {errors.producto && (
                <p className="text-red-500 text-xs mt-1">{errors.producto}</p>
              )}
            </div>
            <label className="block text-sm mt-2">Precio</label>
            <input
              type="number"
              min={1}
              value={precio}
              onChange={(e) => {
                setPrecio(Number(e.target.value));
              }}
              className={`${inputClass("precio")} w-full`}
              disabled
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mt-2">Cantidad</label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => {
                    setCantidad(Number(e.target.value));
                    if (
                      Number(e.target.value) >
                      (ProductList.find((p) => p.name === producto)?.quantity ??
                        90)
                    ) {
                      setCantidad(
                        ProductList.find((p) => p.name === producto)
                          ?.quantity ?? 90
                      );
                      Swal.fire(
                        "Error",
                        "La cantidad no puede ser mayor a la disponible",
                        "error"
                      );
                    }
                  }}
                  className={`${inputClass("cantidad")} w-full`}
                  disabled={!cliente}
                />
                {errors.cantidad && (
                  <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>
                )}
              </div>
              <div className="p-6">
                <p className="text-sm mt-2 font-bold">
                  Cantidad Disponible en stock:{" "}
                  <span className="text-blue-600 text-2xl">
                    {ProductList.find((p) => p.name === producto)?.quantity ??
                      0}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={agregarProducto}
              disabled={!cliente}
              className={`bg-blue-600 text-white mt-3 px-4 py-2 rounded-lg ${
                cliente
                  ? "hover:bg-blue-700 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              Agregar Producto
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <h1 className="text-2xl font-bold mt-8">
        <FontAwesomeIcon className="mr-1" icon={faCartShopping} />
        Productos
      </h1>
      <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-800 text-center text-white">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Cantidad</th>
              <th className="p-4">Precio Unitario</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">Total Linea</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr
                key={i}
                className="text-center text-black even:bg-blue-50 bg-white border-b border-gray-200"
              >
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.quantity}</td>
                <td className="p-4">{numberMiles(p.price ?? 0)}</td>
                <td className="p-4">
                  {numberMiles((p.quantity ?? 0) * (p.price ?? 0))}
                </td>
                <td className="p-4">
                  {numberMiles(
                    (p.quantity ?? 0) * (p.price ?? 0) + (p.iva ?? 0)
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => eliminarProducto(i)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="text-right mt-6 space-y-1">
        <p>
          IVA Total: <strong>${numberMiles(totalIva)}</strong>
        </p>
        <p>
          Total sin IVA: <strong>${numberMiles(totalSinIva)}</strong>
        </p>
        <p>
          Total Factura (IVA Incluido):{" "}
          <strong>${numberMiles(totalFactura)}</strong>
        </p>
      </div>

      {/* Botones */}
      <div className="flex justify-start gap-3 mt-6">
        <button
          type="submit"
          className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FontAwesomeIcon className="mr-2" icon={faSave} />
          Guardar Factura
        </button>
      </div>
    </form>
  );
};

export default SalesInvoice;
