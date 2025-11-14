import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerListSalesInvoice = express.Router();

routerListSalesInvoice.get("/:username", authorizeRole([1, 3]), async (req, res) => {
  const { username } = req.params;
  try {
    const db = await connectDB();

    const [role] = await db.execute(
      `SELECT cargo FROM USUARIO WHERE username = ?`,
      [username]
    );

    const [rows] = await db.execute(
      ` SELECT
        f.id_f id_factura,
        c.nombre AS cliente,
        c.cedula,
        f.fecha_registro,
        f.total,
        f.iva_total,
        u.username AS registrado_por
      FROM FACTURA_VENTA f
      JOIN CLIENTE c ON f.entregado_a = c.cedula
      JOIN USUARIO u ON f.registrado_por = u.Cedula
      ${role[0].cargo != '1' ? `WHERE u.username = ? AND u.estado = true` : ''}
      ORDER BY f.fecha_registro DESC`,
      [username]
    );

    return res.status(200).json(jsonResponse(200, rows));
  } catch (error) {
    console.error("Error al obtener facturas:", error.message);
    return res.status(500).json(jsonResponse(500,{ message: "Error al obtener facturas"}));
  }
});

export default routerListSalesInvoice;
