import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerSelectProduct = express.Router();

routerSelectProduct.get("/", authorizeRole([1,2]), async (req, res) => {
  try {
    const db = await connectDB();
    const [info] = await db.execute(`
      SELECT Id,PRODUCTO.Nombre name,PRODUCTO.Pre_Uni price,PRODUCTO.Cant_Dispo quantity,PRODUCTO.Tiempo_de_refrigeracion refrigeration_time,PRODUCTO.iva_total iva,b.username registered_by,PRODUCTO.fecha_registro
      FROM PRODUCTO
      JOIN USUARIO b ON b.Cedula = PRODUCTO.Registrado_Por
      WHERE PRODUCTO.estado = true
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

export default routerSelectProduct;
