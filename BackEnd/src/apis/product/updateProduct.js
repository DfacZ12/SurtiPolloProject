import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerUpdateUser = express.Router();

routerUpdateUser.put("/:id", authorizeRole([1,2]), async (req, res) => {
  const id = req.params.id;
  const {name,price,quantity,refrigeration_time,iva} = req.body
  try{
    const db = await connectDB();
    await db.execute(
    `UPDATE PRODUCTO SET Nombre = ?, Pre_Uni = ?, Cant_Dispo = ?, Tiempo_de_refrigeracion = ?, iva_total = ?
    where Id = ?`,
    [name,price,quantity,refrigeration_time,iva,id]
    );
    res
      .status(201)
      .json(jsonResponse(201, { message: "Producto actualizado correctamente" }));
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerUpdateUser;
