import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerSelectClient = express.Router();

routerSelectClient.get("/:cedula", authorizeRole([1,3]), async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const db = await connectDB();
    const [info] = await db.execute(`
      SELECT cedula,Nombre name,Apellido lname,Tel_Fijo,Celular,Direccion_Cliente Direccion,Correo,fecha_creacion
      FROM CLIENTE
      WHERE cedula= ? AND estado = true`,[cedula]);

    if (info.length === 0) {
      return res
        .status(404)
        .json(
          jsonResponse(404, { error: "Cliente no se encuentra en el sistema." })
        );
    }
    res.status(201).json(jsonResponse(201, info));
  } catch (error) {
    console.log("Error al obtener clientes:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor" }));
  }
});

export default routerSelectClient;
