import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../auth/AuthProvider";
import {
  faUsers,
  faUserTag,
  faDrumstickBite,
  faDolly,
  faCartShopping,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Tooltip from "../shared/Tooltip";

interface PortalLayoutProps {
  children: React.ReactNode;
}
const PortalLayout = ({ children }: PortalLayoutProps)=> {
  const auth = useAuth();
  const name = auth.getUser()?.name;
  const lastName = auth.getUser()?.lastname;
  const completeName = name && lastName ? `${name} ${lastName}` : "Error Name";
  const role = auth.getUser()?.cargo;
  const abreviateName =
    name && lastName
      ? `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : "";
  return (
    <div className="relative h-full min-h-screen">
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
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/Users"
                    className="menu-item text-green-800 text-[15px] font-medium flex items-center cursor-pointer bg-[#d9f3ea] hover:bg-[#d9f3ea] rounded-md px-3 py-3 transition-all duration-300"
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
                    to="javascript:void(0)"
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
                    to="javascript:void(0)"
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
                    to="javascript:void(0)"
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
                    to="javascript:void(0)"
                    className="menu-item text-slate-800 text-[15px] font-medium flex items-center cursor-pointer hover:bg-[#d9f3ea] rounded-md px-3 py-3 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faDolly}
                      className="w-[18px] h-[18px] mr-3"
                    />
                    <span>Factura Proveedor</span>
                  </Link>
                </li>
              </ul>
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
                  // onClick={onSignOut}
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
          <div>
            <div className="flex items-center flex-wrap gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 ">
                  Bienvenido! {name}
                </h3>
                <p className="text-xs text-text-800">
                  Streamlined dashboard layout featuring a welcoming header for
                  user personalization.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 mb-6 px-2">{children}</div>
        </section>
      </div>
    </div>
  );
}

export default PortalLayout;