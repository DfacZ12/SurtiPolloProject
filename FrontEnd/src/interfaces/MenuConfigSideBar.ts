import { faUsers, faBoxOpen, faCartShopping, faDolly, faUserTag } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface iSubMenuItem {
  label: string;
  title: string;
  path: string;
}

export interface iMenuItem {
  id: string;
  label: string;
  title?:string;
  icon: IconProp;
  path?: string;
  submenus?: iSubMenuItem[];
  roles: string[]
}
export const menuItems: iMenuItem[] = [
  {
    id: "usuarios",
    label: "Usuarios",
    icon: faUsers,
    submenus: [
      { label: "Lista Usuarios",title:"Lista de Usuarios", path: "/Users/List" },
      { label: "Nuevo Usuario",title:"Creación de Usuarios", path: "/Users/Create" },
    ],
    roles: ["Administrador"],
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: faUserTag,
    submenus: [
      { label: "Lista clientes", title:"Lista de Clientes",path: "/Clients/List" },
      { label: "Nuevo cliente", title:"Creación de Clientes",path: "/Clients/Create" },
    ],
    roles: ["Administrador", "Cajero"],
  },
  {
    id: "productos",
    label: "Productos",
    icon: faBoxOpen,
    submenus: [
      { label: "Lista Productos", title:"Lista de Productos",path: "/Products/List" },
      { label: "Nuevo Producto", title:"Creación de Productos",path: "/Products/Create" },
    ],
    roles: ["Administrador", "Almacenista"],
  },
  {
    id: "facuturaVenta",
    label: "Factura Venta",
    title: "Factura de Venta",
    icon: faCartShopping,
    path: "/SalesInvoice",
    roles: ["Administrador", "Cajero"],
  },
    {
    id: "facuturaProveedor",
    label: "Factura Proveedor",
    title: "Factura de Proveedor",
    icon: faDolly,
    path: "/SupplierInvoice",
    roles:  ["Administrador", "Almacenista"],
  },
];
