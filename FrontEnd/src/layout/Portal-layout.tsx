import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../auth/AuthProvider";
import {Outlet } from "react-router-dom";
import Tooltip from "../shared/Tooltip";
import axios from "axios";
import { API_URL } from "../auth/consts";
import SidebarScript from "../util/sidebarScript";
import Sidebar from "./sideBar";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const PortalLayout = () => {
  const auth = useAuth();
  const name = auth.getUser()?.name;
  const lastName = auth.getUser()?.lastname;
  const completeName = name && lastName ? `${name} ${lastName}` : "Error Name";
  const role = auth.getUser()?.cargo;
  const abreviateName =
    name && lastName
      ? `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : "";
  const handleSignout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${API_URL}/signout`, {
        headers: { Authorization: `Bearer ${auth.getRefreshToken()}` },
      });
      if (response.status === 201) {
        auth.signOut();
      }
    } catch (e) {
      console.error("error al cerrar sesión", e);
    }
  };
  return (
    <div className="relative h-full min-h-screen">
      <SidebarScript />
      <div className="flex items-start">
        <nav id="sidebar" className="lg:min-w-[270px] w-max max-lg:min-w-8">
          <div
            id="sidebar-collapse-menu"
            className="bg-white shadow-lg h-screen fixed top-0 left-0 overflow-auto z-[99] lg:min-w-[250px] lg:w-max max-lg:w-0 max-lg:invisible transition-all duration-500 flex flex-col"
          >
            <div className="pt-8 pb-2 px-6 sticky top-0 bg-white min-h-[80px] z-[100]">
              <img
                src="https://readymadeui.com/readymadeui.svg"
                alt="logo"
                className="w-[170px]"
              />
            </div>

            <div className="py-6 px-6 flex-1 overflow-y-auto">
              {/* <ul className="space-y-2">
                <li>
                  <div
                    className="text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea] rounded-md px-3 py-2.5 transition-all duration-300">
                      <FontAwesomeIcon
                      icon={faUsers}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">Usuarios</span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="arrowIcon w-3 fill-current -rotate-90 ml-auto transition-all duration-500"
                      viewBox="0 0 451.847 451.847">
                      <path
                        d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                        data-original="#000000" />
                    </svg>
                  </div>
                  <ul className="sub menu max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                    <li>
                      <Link to="/Users/List"
                        className="text-slate-800 text-[15px] font-medium block cursor-pointer hover:bg-[#d9f3ea]  rounded-md px-3 py-2 transition-all duration-300">
                        <span>Lista Usuarios</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Users/Create"
                        className="text-slate-800 text-[15px] font-medium block cursor-pointer hover:bg-[#d9f3ea]  rounded-md px-3 py-2 transition-all duration-300">
                        <span>Crear Usuario</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to="/Users"
                    className="menu-item text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea]  rounded-md px-3 py-3 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span>Usuarios</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Products"
                    className="menu-item text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea] rounded-md px-3 py-3 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faDrumstickBite}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span>Productos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Clients"
                    className="menu-item text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea] rounded-md px-3 py-3 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faUserTag}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span>Clientes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/FacturaVenta"
                    className="menu-item text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea] rounded-md px-3 py-3 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span>Factura Venta</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/FacturaProveedor"
                    className="menu-item text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea] rounded-md px-3 py-3 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faDolly}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span>Factura Proveedor</span>
                  </Link>
                </li>
              </ul> */}
              <Sidebar />
            </div>
            <div className="mt-auto p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {abreviateName}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-text-800 whitespace-nowrap">
                      {completeName}
                    </p>
                    <p className="text-xs font-bold text-text-800 whitespace-nowrap">
                      {role}
                    </p>
                  </div>
                </div>
                <Tooltip content="Cerrar sesión" side="top">
                  <button
                    onClick={handleSignout}
                    className="text-slate-500 hover:text-red-600 transition-colors duration-300 ml-3 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-5 h-5"
                    />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </nav>

        <button
          id="open-sidebar"
          className="ml-auto fixed top-[30px] left-[18px] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 fill-gray-300"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M.13 17.05a1.41 1.41 0 0 1 1.41-1.41H10a1.41 1.41 0 1 1 0 2.82H1.54a1.41 1.41 0 0 1-1.41-1.41zm0-14.1a1.41 1.41 0 0 1 1.41-1.41h16.92a1.41 1.41 0 1 1 0 2.82H1.54A1.41 1.41 0 0 1 .13 2.95zm0 7.05a1.41 1.41 0 0 1 1.41-1.41h16.92a1.41 1.41 0 1 1 0 2.82H1.54A1.41 1.41 0 0 1 .13 10z"
              clip-rule="evenodd"
              data-original="#000000"
            />
          </svg>
        </button>

        <section className="main-content w-full p-6 max-lg:ml-8">
            <Outlet />
        </section>
      </div>
    </div>
  );
};

export default PortalLayout;
