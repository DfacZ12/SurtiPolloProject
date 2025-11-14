import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import axios from "axios";
import { API_URL } from "../../auth/Consts";
import type { IProduct } from "../../interfaces/IProduct";
import Tooltip from "../../shared/Tooltip";
import UpdateProduct from "./UpdateProduct";
import Modal from "../../shared/Modal";
import Swal from "sweetalert2";

const ListProducts = () => {
  const auth = useAuth();
  const [ProductList, setProductList] = useState<[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  useEffect(() => {
    handleListProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleListProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/listProducts`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 200) {
        setProductList(response.data.body);
      }
    } catch (e) {
      console.error("error al Traer la info del usuario.", e);
    }
  };

  const confirmDeleteProduct = async (Id: number) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Estas seguro que deseas eliminar el producto?",
      text: "Esta acción no se puede deshacer.",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: "No",
    });
    if (result.isConfirmed) {
      await deleteProduct(Id);
    }
    if (result.isDenied) {
      Swal.fire("Operación cancelada", "", "info");
    }
  };

  const deleteProduct = async (Id: number) => {
    try {
      const response = await axios.put(
        `${API_URL}/deleteProduct/${Id}`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
        }
      );
      if (response.status === 201) {
        handleListProduct();
        Swal.fire(response.data.body.message, "", "success");
      }
    } catch (e) {
      console.error("error al eliminar el usuario.", e);
      Swal.fire("Error al eliminar el usuario", "", "error");
    }
  };

  const formatFecha = (fecha: string): string => {
    const fechaDate = new Date(fecha);
    const nombreMes = fechaDate.getMonth()
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${fechaDate.getDate()} de ${meses[nombreMes]} de ${fechaDate.getFullYear()}`;
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="bg-gray-800 whitespace-nowrap text-center">
          <tr>
            <th className="p-4 text-sm font-medium text-white">Id</th>
            <th className="p-4 text-sm font-medium text-white">Nombre</th>
            <th className="p-4 text-sm font-medium text-white">
              Precio Unitario
            </th>
            <th className="p-4 text-sm font-medium text-white">Cantidad</th>
            <th className="p-4 text-sm font-medium text-white">
              Tiempo Refrigeracion
            </th>
            <th className="p-4 text-sm font-medium text-white">IVA</th>
            <th className="p-4 text-sm font-medium text-white">
              Registrador Por
            </th>
            <th className="p-4 text-sm font-medium text-white">
              Fecha Creación
            </th>
            <th className="p-4 text-sm font-medium text-white">Actions</th>
          </tr>
        </thead>

        <tbody className="whitespace-nowrap">
          {ProductList.length === 0 ? (
            <tr>
              <td
                colSpan={13}
                className="text-center p-4 text-red-700 font-bold"
              >
                No se encuentran Productos Registrados.
              </td>
            </tr>
          ) : (
            ProductList.map((product: IProduct, index) => (
              <tr
                key={index}
                className="even:bg-blue-50 bg-white border-b border-gray-200"
              >
                <td className="p-4 text-center text-sm text-black">
                  {product.Id}
                </td>
                <td className="p-4 text-center text-sm text-black">
                  {product.name}
                </td>
                <td className="p-4 text-center text-sm text-black">
                  {product.price}
                </td>
                <td className="p-4 text-center text-sm text-black">
                  {product.quantity}
                </td>
                <td className="p-4 text-center text-sm text-black">
                  {product.refrigeration_time}
                </td>
                <td className="p-4 text-center text-sm text-black">
                  {product.iva}
                </td>
                <td className="p-4 text-center text-sm text-green-600">
                  {product.registered_by}
                </td>
                <td className="p-4 text-center text-sm text-black">
                  {formatFecha(product.fecha_registro ?? "")}
                </td>
                <td className="p-4 ">
                  <Tooltip content="Actualizar" side="top">
                    <button
                      onClick={() => setSelectedProduct(product.Id ?? 0)}
                      className="mr-4 cursor-pointer text-center "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 fill-blue-500 hover:fill-blue-700"
                        viewBox="0 0 348.882 348.882"
                      >
                        <path
                          d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                          data-original="#000000"
                        />
                        <path
                          d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                  </Tooltip>

                  <Tooltip content="Eliminar Usuario" side="top">
                    <button
                      className="mr-4 cursor-pointer"
                      onClick={() => confirmDeleteProduct(product.Id ?? 0)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 fill-red-500 hover:fill-red-700"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                          data-original="#000000"
                        />
                        <path
                          d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* modal */}
      <Modal
        show={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Actualizar Producto"
      >
        <UpdateProduct
          Id={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdated={() => handleListProduct()}
        />
      </Modal>
    </div>
  );
};

export default ListProducts;
