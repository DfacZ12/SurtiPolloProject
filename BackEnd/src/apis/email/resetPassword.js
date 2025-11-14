import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../../../DB/db.js";
import { jsonResponse } from "../../../lib/jsonResponse.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { token, newPassword } = req.body;

  try {

    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (payload.type !== "password_reset") {
      return res.status(400).json(jsonResponse(400, { error: "Token inválido" }));
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const db = await connectDB();

    await db.execute(
      "UPDATE USUARIO SET password = ?, firstLogin = false WHERE Cedula = ?",
      [hashed, payload.Cedula]
    );

    res.status(200).json(
      jsonResponse(200, { message: "Contraseña actualizada correctamente" })
    );

  } catch (error) {
    console.error(error);
    return res.status(400).json(jsonResponse(400, { error: "Token inválido o expirado" }));
  }
});

export default router;
