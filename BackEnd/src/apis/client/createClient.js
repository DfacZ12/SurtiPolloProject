import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerCreateClient = express.Router();

routerCreateClient.post("/", authorizeRole([1,3]),async (req, res) => {
  const { name, lname, cedula,phone, number, direccion, email, registered_by } = req.body;
  if (!name || !lname || !cedula || !number || !direccion || !email || !registered_by) {
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
      `INSERT INTO CLIENTE (Cedula, Nombre, Apellido, Tel_Fijo, Celular, Direccion_Cliente, Correo, Registrado_Por, Estado,fecha_registro)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,true,NOW())`,
      [cedula, name, lname, phone || null, number, direccion, email, ccUser[0].Cedula]
    );

    res.status(201).json(
      jsonResponse(201, {
        message: "Cliente Creado correctamente.",
      })
    );
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerCreateClient;
