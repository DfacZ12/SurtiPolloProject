import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerCreateProduct = express.Router();

routerCreateProduct.post("/", authorizeRole([1,2]),async (req, res) => {
  const { name, price, quantity, refrigeration_time, iva, registered_by } = req.body;
  if (!name || !price || !quantity || !refrigeration_time || !iva || !registered_by) {
    return res.status(400).json(jsonResponse(400, { message: "Faltan campos obligatorios." }));
  }
  try {
    const db = await connectDB();
    const [ccUser] = await db.execute(
      `SELECT Cedula FROM USUARIO WHERE username = ? and estado = true`,
      [registered_by]
    );
    if (ccUser.length === 0) {
      return res.status(404).json(jsonResponse(404, { message: "Usuario no encontrado." }));
    }
    await db.execute(
      `INSERT INTO PRODUCTO (Nombre, Pre_Uni, Cant_Dispo, Tiempo_de_refrigeracion, iva_total, Registrado_Por, Estado,fecha_registro)
      VALUES (?, ?, ?, ?, ?, ?,true,NOW())`,
      [name, price, quantity, refrigeration_time, iva, ccUser[0].Cedula]
    );

    res.status(201).json(
      jsonResponse(201, {
        message: "Producto Creado correctamente.",
      })
    );
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerCreateProduct;
