import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { menuItems } from "../interfaces/MenuConfigSideBar"
import type { iSubMenuItem } from "../interfaces/MenuConfigSideBar"
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface SidebarProps {
  onSelectMenu?: (title: string, icon: IconProp) => void;
}

export default function Sidebar({onSelectMenu}:SidebarProps) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleToggleMenu = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isAnySubmenuActive = (submenus?: iSubMenuItem[]) =>
    submenus?.some((submenu) => submenu.path === location.pathname);

  return (
    <ul id="sidebar" className="space-y-2">
      {menuItems.map((menu) => {
        const hasSubmenus = !!menu.submenus?.length;
        const activeParent = isAnySubmenuActive(menu.submenus);

        return (
          <li key={menu.id}>
            {/* Menú principal */}
            <div
              onClick={ () =>{
                if (!hasSubmenus) {
                  onSelectMenu?.(menu?.title ?? "", menu.icon);
                  return
                }
                handleToggleMenu(menu.id);
              }}
              className={`flex items-center cursor-pointer rounded-md px-3 py-2.5 text-[15px] font-medium text-slate-800 transition-all duration-300 hover:bg-[#d9f3ea]
                ${activeParent || isActive(menu.path) ? "bg-[#d9f3ea] font-semibold" : ""}`}
            >
              <FontAwesomeIcon icon={menu.icon} className="w-[18px] h-[18px] mr-3" />

              {/* Si el menú tiene link directo */}
              {menu.path ? (
                <Link to={menu.path}
                 className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {menu.label}
                </Link>
              ) : (
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {menu.label}
                </span>
              )}

              {/* Mostrar flecha solo si tiene submenús */}
              {hasSubmenus && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`arrowIcon w-3 fill-current ml-auto transition-all duration-500 ${
                    openMenu === menu.id || activeParent ? "rotate-0" : "-rotate-90"
                  }`}
                  viewBox="0 0 451.847 451.847"
                >
                  <path
                    d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z"
                    data-original="#000000"
                  />
                </svg>
              )}
            </div>

            {/* Submenús (solo si existen) */}
            {hasSubmenus && (
              <ul
                className={`ml-8 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  openMenu === menu.id || activeParent ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                {menu.submenus!.map((submenu) => (
                  <li key={submenu.path}>
                    <Link
                      onClick={() => onSelectMenu?.(submenu.title, menu.icon)}
                      to={submenu.path}
                      className={`block my-1 rounded-md px-3 py-2 text-[15px] font-medium text-slate-800 transition-all duration-300 hover:bg-[#d9f3ea]
                        ${isActive(submenu.path) ? "bg-[#d9f3ea] font-semibold" : ""}`}
                    >
                      {submenu.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
