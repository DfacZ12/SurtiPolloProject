import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerSelectUser = express.Router();

routerSelectUser.get("/", authorizeRole([1,2]), async (req, res) => {
  try {
    const db = await connectDB();
    const [info] = await db.execute(`
      SELECT Id,Nombre name,Pre_Uni price,Cant_Dispo quantity,Tiempo_de_refrigeracion refrigeration_time,iva_total iva,Registrado_Por registered_by,fecha_registro
      FROM PRODUCTO
      WHERE estado = true
      ORDER BY Id
    `);

    if (info.length === 0) {
      return res
        .status(404)
        .json(
          jsonResponse(404, { error: "No se encuentran productos registrados." })
        );
    }
    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener productos:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor" }));
  }
});

export default routerSelectUser;
