import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerDeleteUser = express.Router();

routerDeleteUser.put("/:cedula", authorizeRole([1,2]), async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const db = await connectDB();
    await db.execute(
      `UPDATE PRODUCTO SET Estado=false where Cedula = ?`,
      [cedula]
    );
    res
      .status(201)
      .json(jsonResponse(201, { message: "Producto Eliminado correctamente." }));
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerDeleteUser;
