import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerListSalesInvoice = express.Router();

routerListSalesInvoice.get("/", authorizeRole([1, 3]), async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      ` SELECT
        f.id_f id_factura,
        c.nombre AS cliente,
        c.cedula,
        f.fecha_registro,
        f.total,
        f.iva_total,
        u.username AS registrado_por
      FROM factura_venta f
      JOIN cliente c ON f.entregado_a = c.cedula
      JOIN usuario u ON f.registrado_por = u.Cedula
      ORDER BY f.fecha_registro DESC`);

    return res.status(200).json(jsonResponse(200, rows));
  } catch (error) {
    console.error("❌ Error en getInvoices:", error.message);
    return res.status(500).json({
      message: "Error al obtener facturas",
      error: error.message,
    });
  }
});

export default routerListSalesInvoice;
