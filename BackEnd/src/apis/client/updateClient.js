import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerUpdateClient = express.Router();

routerUpdateClient.put("/:cedula", authorizeRole([1,3]), async (req, res) => {
  const cedula = req.params.cedula;
  const {name,lname,phone,number,direccion,email} = req.body
  try{
    const db = await connectDB();
    await db.execute(
    `UPDATE CLIENTE SET Nombre = ?, Apellido = ?, Tel_Fijo = ?, Celular = ?, Direccion_Cliente = ?, Correo = ?
    WHERE cedula = ? AND estado = true`,
    [name,lname,phone || null,number,direccion,email,cedula]
    );
    res
      .status(201)
      .json(jsonResponse(201, { message: "Cliente actualizado correctamente" }));
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerUpdateClient;
