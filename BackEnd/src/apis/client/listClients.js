import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerListClient = express.Router();

routerListClient.get("/", authorizeRole([1,3]), async (req, res) => {
  try {
    const db = await connectDB();
    const [info] = await db.execute(`
      SELECT CLIENTE.cedula,CLIENTE.Nombre name,CLIENTE.Apellido lname,CLIENTE.Tel_Fijo,CLIENTE.Celular,CLIENTE.Direccion_Cliente Direccion ,CLIENTE.Correo,b.username Registered_by,CLIENTE.fecha_registro
      FROM CLIENTE
      JOIN USUARIO b ON b.Cedula = CLIENTE.Registrado_Por
      WHERE CLIENTE.estado = true
      ORDER BY CLIENTE.Nombre
    `);

    if (info.length === 0) {
      return res
        .status(404)
        .json(
          jsonResponse(404, { error: "No se encuentran clientes registrados." })
        );
    }
    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener clientes:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor" }));
  }
});

export default routerListClient;
