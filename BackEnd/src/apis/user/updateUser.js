import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerUpdateUser = express.Router();

routerUpdateUser.put("/:cedula", authorizeRole([1]), async (req, res) => {
  const cedula = req.params.cedula;
  const {name,lname,cc,direccion,number,phone,email,eps,cargo} = req.body
  try{
    const db = await connectDB();
    await db.execute(
    `UPDATE USUARIO SET Nombre = ?, Apellido = ?, Cedula = ?, Direccion = ?, Correo = ? , Celular = ?, Tel_Fijo = ?,EPS = ?, Cargo = ? where Cedula = ?`,
  [name,lname,cc,direccion,email,number,phone || null,eps,cargo,cedula]
    );
    res
      .status(201)
      .json(jsonResponse(201, { message: "Usuario Actualizado Correctamente" }));
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerUpdateUser;
