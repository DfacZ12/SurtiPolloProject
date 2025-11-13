import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerDeleteClient = express.Router();

routerDeleteClient.put("/:cedula", authorizeRole([1,3]), async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const db = await connectDB();
    await db.execute(
      `UPDATE CLIENTE SET Estado=false where cedula = ?`,
      [cedula]
    );
    res
      .status(201)
      .json(jsonResponse(201, { message: "Cliente Eliminado correctamente." }));
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerDeleteClient;
