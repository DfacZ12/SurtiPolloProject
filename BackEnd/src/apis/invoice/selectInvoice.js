import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerListSalesInvoice = express.Router();

routerListSalesInvoice.get("/:id", authorizeRole([1, 3]), async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      `SELECT
        f.id_f as facturaId,
        c.nombre,
        c.apellido,
        c.cedula,
        f.fecha_registro,
        f.total as total_factura,
        f.iva_total
      FROM FACTURA_VENTA f
      JOIN CLIENTE c ON f.entregado_a = c.cedula
      WHERE f.id_f = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json(jsonResponse(404, { message: "Factura no encontrada." }));
    }

    const [detalle] = await db.execute(
      `	SELECT
        f.Prod_vend,
        c.nombre AS nombre_producto,
        f.Cant_Prod as cantidad,
        f.prec_venta_prod as precio_unitario,
        f.iva
      FROM DETALLE_FACT_VEN f
      JOIN PRODUCTO c ON f.Prod_vend = c.ID
      WHERE ID_FACT_VENTA = ?`,
        [id]
      )
    await Promise.all(detalle);
    const nameClient = `${rows[0].nombre} ${rows[0].apellido}`;
    const objectInvoice= {
      factura: {...rows[0], nombre:nameClient},
      detalles: [...detalle]
    }
    return res.status(200).json(jsonResponse(200, objectInvoice));
  } catch (error) {
    console.error("Error al obtener factura:", error.message);
    return res.status(500).json(jsonResponse(500,{ message: "Error al obtener factura"}));
  }
});

export default routerListSalesInvoice;
