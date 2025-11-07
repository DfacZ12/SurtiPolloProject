import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerSelectUser = express.Router();

routerSelectUser.get("/", authorizeRole([1]), async (req, res) => {
  try {
    const db = await connectDB();
    const [info] = await db.execute(`
      SELECT a.cedula, a.Nombre, a.Apellido, a.Direccion,
             b.EPS_Nombre AS EPS, a.Tel_Fijo, a.Celular, a.Correo,
             aa.username AS Registrador_Por, a.username,
             c.NombreCargo AS cargo, a.fecha_creacion
      FROM USUARIO a
      JOIN USUARIO aa ON a.cedula = aa.Registrado_Por
      JOIN EPS b ON a.EPS = b.COD_EPS
      JOIN CARGO c ON a.cargo = c.id
      WHERE a.estado = true
      ORDER BY Nombre DESC
    `);

    if (info.length === 0) {
      return res
        .status(404)
        .json(
          jsonResponse(404, { error: "No se encuentran usuarios registrados." })
        );
    }
    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener usuarios:", error);
    res
      .status(500)
      .json(jsonResponse(500, { message: "Error interno del servidor" }));
  }
});

export default routerSelectUser;
