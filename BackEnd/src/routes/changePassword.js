// routes/auth.routes.ts
import express from "express";
import bcrypt from "bcrypt";
import { connectDB } from "../../DB/db.js";
import { jsonResponse } from "../../lib/jsonResponse.js";

const routerChangePassword = express.Router();

routerChangePassword.post("/:username", async (req, res) => {
  try {
    const db = await connectDB();
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json(jsonResponse(400,{ message: "Faltan campos" }));

    const [user] = await db.execute(
      `SELECT * FROM USUARIO WHERE username = ?`,
      [username]
    );
    if (!user) return res.status(404).json(jsonResponse(404,{ message: "Usuario no encontrado" }));

    const isValid = await bcrypt.compare(oldPassword, user[0].password);
    if (!isValid)
      return res.status(401).json(jsonResponse(401,{ message: "Contraseña actual incorrecta" }));

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute(
      `UPDATE USUARIO SET password = ?, firstLogin = ? WHERE Cedula = ?`,
      [hashed, false, user[0].Cedula]
    );

    return res.status(200).json(jsonResponse(200,{
      message: "Contraseña actualizada correctamente. Inicia sesión nuevamente.",
    }));
  } catch (err) {
    console.error("Error cambiando contraseña:", err);
    return res.status(500).json(jsonResponse(500,{ message: "Error interno del servidor" }));
  }
});

export default routerChangePassword;
