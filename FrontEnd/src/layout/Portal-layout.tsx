import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../auth/AuthProvider";
import {Outlet, useLocation } from "react-router-dom";
import Tooltip from "../shared/Tooltip";
import axios from "axios";
import { API_URL } from "../auth/consts";
import Sidebar from "./sideBar";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { flattenMenu } from "../util/FlatMenuItem";

const PortalLayout = () => {
  const location = useLocation();
  const [gestTitle, setGestTitle] = useState<string>("");
  const [gestIconTitle, setGestIconTitle] = useState<IconProp>();
  const auth = useAuth();
  const name = auth.getUser()?.name;
  const lastName = auth.getUser()?.lastname;
  const completeName = name && lastName ? `${name} ${lastName}` : "Error Name";
  const role = auth.getUser()?.cargo;
  const abreviateName =
    name && lastName
      ? `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : "";

  const handleLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${API_URL}/logOut`, {
        headers: { Authorization: `Bearer ${auth.getRefreshToken()}` },
      });
      if (response.status === 201) {
        auth.logOut();
      }
    } catch (e) {
      console.error("error al cerrar sesión", e);
    }
  };

  useEffect(() => {
    const flat = flattenMenu();
    const found = flat.find((item) => item.path === location.pathname);

    if (found) {
      setGestTitle(found.title);
      setGestIconTitle(found.icon);
      localStorage.setItem("gestTitle", found.title);
      if (typeof found.icon === "object" && "iconName" in found.icon) {
        localStorage.setItem("gestIconTitle", found.icon.iconName);
      }
    } else {
      const savedTitle = localStorage.getItem("gestTitle");
      const savedIcon = localStorage.getItem("gestIconTitle");

      if (savedTitle) setGestTitle(savedTitle);

      if (savedIcon) {
        const allIcons = flattenMenu().reduce((acc, item) => {
          if (typeof item.icon === "object" && "iconName" in item.icon) {
            acc[item.icon.iconName] = item.icon;
          }
          return acc;
        }, {} as Record<string, IconProp>);
        if (allIcons[savedIcon]) setGestIconTitle(allIcons[savedIcon]);
      }
    }
  }, [location]);

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
              <Sidebar
                onSelectMenu={(title, icon) => {
                  setGestTitle(title);
                  setGestIconTitle(icon);
                  localStorage.setItem("gestTitle", title);
                  if (typeof icon === "object" && "iconName" in icon) {
                    localStorage.setItem("gestIconTitle", icon.iconName);
                  }
                }}
              />
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
                    onClick={handleLogOut}
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
          <h1 className="text-3xl font-bold mb-12">
                {gestIconTitle && (
                  <FontAwesomeIcon icon={gestIconTitle} className="w-[18px] h-[18px] mr-2" />
                )}
              {gestTitle}
          </h1>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default PortalLayout;
