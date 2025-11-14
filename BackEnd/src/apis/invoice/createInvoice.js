import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { authorizeRole } from "../../../auth/authRoles.js";
import { createTransactionConnection } from "../../../DB/db.js";

const routerCreateInvoice = express.Router();

routerCreateInvoice.post("/", authorizeRole([1,3]), async (req, res) => {
  const { factura, detalles } = req.body;
  if (!factura || !detalles || detalles.length === 0) {
    return res.status(400).json(jsonResponse(400,{ message: "Factura o detalles inválidos." }));
  }
  const db = await createTransactionConnection();

  try {
    await db.beginTransaction();

    const [ccUser] = await db.execute(
      `SELECT Cedula FROM USUARIO WHERE username = ? and estado = true`,
      [factura.registered_by]
    );
    if (ccUser.length === 0) {
      return res.status(404).json(jsonResponse(404, { message: "Usuario no encontrado." }));
    }

    const [facturaResult] = await db.execute(
      `INSERT INTO FACTURA_VENTA (entregado_a, fecha_registro, total, registrado_por, iva_total)
       VALUES (?, NOW(), ?, ?, ?)`,
      [factura.cedula, factura.total_factura, ccUser[0].Cedula, factura.iva_total]
    );

    const facturaId = facturaResult.insertId;

    const detallePromises = detalles.map((item) =>
      db.execute(
        `INSERT INTO DETALLE_FACT_VEN (id_fact_venta, prod_vend, cant_prod, prec_venta_prod, iva)
         VALUES (?, ?, ?, ?, ?)`,
        [facturaId, item.id_producto, item.cantidad, item.precio_unitario, item.iva]
      )
    );

    await Promise.all(detallePromises);
    await db.commit();

    return res.status(201).json(jsonResponse(201,facturaId));
  } catch (error) {
    await db.rollback();
    console.error("❌ Error en createInvoice:", error);
    return res.status(500).json(jsonResponse(500, { message: "Error al registrar la factura" }));
  } finally {
    db.release();
  }
});

export default routerCreateInvoice;
