import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerCreateUser = express.Router();

routerCreateUser.post("/", authorizeRole([1,2]),async (req, res) => {
  const { name, price, cant, tmpoRefri, iva, registered_by } = req.body;

  if (!name || !price || !cant || !tmpoRefri || !iva || !registered_by) {
    return res.status(400).json(jsonResponse(400, { message: "Faltan campos obligatorios." }));
  }

  try {
    const db = await connectDB();

    await db.execute(
      `INSERT INTO PRODUCTO (Nombre, Pre_Uni, Cant_Dispo, Tiempo_de_refrigeracion, iva_total, Registrado_Por, fecha_registro)
      VALUES (?, ?, ?, ?, ?, ?,NOW())`,
      [name, price, cant, tmpoRefri, iva, registered_by]
    );

    res.status(201).json(
      jsonResponse(201, {
        message: "Producto Creado correctamente.",
      })
    );
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerCreateUser;
