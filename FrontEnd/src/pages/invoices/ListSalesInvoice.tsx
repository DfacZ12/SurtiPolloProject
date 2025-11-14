import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../auth/Consts";
import { useAuth } from "../../auth/AuthProvider";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import type { IInvoice, IListInvoice } from "../../interfaces/IInvoice";
import Tooltip from "../../shared/Tooltip";
import Swal from "sweetalert2";
import { generatePDF } from "../../util/InvoiceResultActions";

const ListSalesInvoice = () => {
  const auth = useAuth();

  const [facturas, setFacturas] = useState<IListInvoice[]>([]);
  const [filtered, setFiltered] = useState<IListInvoice[]>([]);
  const [search, setSearch] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    getFacturas();
  }, []);

  const getFacturas = async () => {
    try {
      const response = await axios.get(`${API_URL}/listInvoice/${auth.getUser()?.username}`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 200) {
        setFacturas(response.data.body);
        setFiltered(response.data.body);
      }
    } catch {
      toast.error("Error al obtener facturas");
    }
  };

  const handleSearch = () => {
    let result = [...facturas];
    if (search.trim() !== "") {
      result = result.filter((f) => f.cedula == search);
    }

    if (desde && hasta) {
      const desdeDate = new Date(`${desde}T00:00:00`);
      const hastaDate = new Date(`${hasta}T23:59:59`);

      result = result.filter((f) => {
        const facturaDate = new Date(f.fecha_registro);
        return facturaDate >= desdeDate && facturaDate <= hastaDate;
      });
    }
    setFiltered(result);
  };

  const limpiarFiltros = () => {
    setSearch("");
    setDesde("");
    setHasta("");
    setFiltered(facturas);
  };

  const numberMiles = (num: string): string => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getInfoInvoice = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/selectInvoice/${id}`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` },
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Factura obtenida correctamente",
        });
        generatePDF(response.data.body as IInvoice);
      }
    } catch{
      toast.error("Error al obtener facturas");
    }
  };

  return (
    <div className="mx-auto bg-white shadow-lg rounded-md p-6">
      <h1 className="text-2xl font-bold mb-6">Consulta de Facturas</h1>

      {/* Filtros */}
      <div className="grid md:grid-cols-4 grid-cols-1 gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente por cédula"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
        />
        <input
          type="date"
          value={desde}
          onChange={(e) => {
            const nuevaDesde = e.target.value;
            setDesde(nuevaDesde);
            if (hasta && nuevaDesde > hasta) {
              setHasta(nuevaDesde);
            }
          }}
          max={hasta || undefined}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
        />

        <input
          type="date"
          value={hasta}
          onChange={(e) => {
            const nuevaHasta = e.target.value;
            setHasta(nuevaHasta);

            // Si "desde" ya tiene una fecha y es mayor que la nueva "hasta", ajustarla
            if (desde && nuevaHasta < desde) {
              setDesde(nuevaHasta);
            }
          }}
          min={desde || undefined}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500 outline-none"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 cursor-pointer"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Buscar
          </button>
          <button
            onClick={limpiarFiltros}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-800 text-white text-center">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Cédula</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Total</th>
              <th className="p-4">IVA</th>
              <th className="p-4">Registrado por</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6">
                  No hay facturas registradas
                </td>
              </tr>
            ) : (
              filtered.map((f, i) => (
                <tr
                  key={i}
                  className="text-center even:bg-blue-50 bg-white border-b border-gray-200"
                >
                  <td className="p-4">{f.id_factura}</td>
                  <td className="p-4">{f.cliente}</td>
                  <td className="p-4">{f.cedula}</td>
                  <td className="p-4">
                    {new Date(f.fecha_registro).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold">
                    ${numberMiles(Number(f.total).toFixed())}
                  </td>
                  <td className="p-4">
                    ${numberMiles(Number(f.iva_total).toFixed())}
                  </td>
                  <td className="p-4 text-green-600 font-bold">
                    {f.registrado_por}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <Tooltip content="Descargar Factura" side="top">
                      <button
                        onClick={() => getInfoInvoice(f.id_factura)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListSalesInvoice;
