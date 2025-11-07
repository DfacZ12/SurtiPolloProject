import express from "express";
import { connectDB } from "../../DB/db.js";

const routerLogOut = express.Router();

routerLogOut.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const refreshToken = authHeader.split(" ")[1];

    const db = await connectDB();
    // Elimina o invalida el refresh token del usuario
    await db.execute("UPDATE USUARIO SET refresh_token = NULL WHERE refresh_token = ?", [refreshToken]);

    return res.status(201).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default routerLogOut;
