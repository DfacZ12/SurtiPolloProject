import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerSelectUser = express.Router();

routerSelectUser.get("/:id", authorizeRole([1]), async (req, res) => {
  const id = req.params.id;
  try {
    const db = await connectDB();
    const [info] = await db.execute(`
      SELECT Id,Nombre,Pre_Uni,Cant_Dispo,Tiempo_de_refrigeracion,iva_total,Registrado_Por,fecha_registro
      FROM PRODUCTO WHERE Id= ? AND estado = true`,[id]);

    if (info.length === 0) {
      return res
        .status(404)
        .json(
          jsonResponse(404, { error: "No se encuentran la info del usuario" })
        );
    }
    res.status(201).json(jsonResponse(201, info));
  } catch (error) {
    console.log("Error al obtener usuarios:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor" }));
  }
});

export default routerSelectUser;
