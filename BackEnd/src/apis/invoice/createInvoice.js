import express from "express";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { authorizeRole } from "../../../auth/authRoles.js";
import { createTransactionConnection } from "../../../DB/db.js";

const routerCreateInvoice = express.Router();

routerCreateInvoice.post("/", authorizeRole([1,3]),async (req, res) => {
  const { factura, detalles } = req.body;
  if (!factura || !detalles || detalles.length === 0) {
    return res
      .status(400)
      .json(jsonResponse(400, { message: "Factura o detalles inválidos." }));
  }
  const db = await createTransactionConnection();

    try {
    await db.beginTransaction();

    // Validar usuario
    const [user] = await db.execute(
      `SELECT Cedula FROM USUARIO WHERE username = ? AND estado = true`,
      [factura.registered_by]
    );

    if (user.length === 0) {
      await db.rollback();
      return res.status(404).json(jsonResponse(404, { message: "Usuario no encontrado." }));
    }

    // Validar cliente
    const [client] = await db.execute(
      `SELECT Cedula FROM CLIENTE WHERE Cedula = ? AND estado = true`,
      [factura.cedula]
    );

    if (client.length === 0) {
      await db.rollback();
      return res.status(404).json(jsonResponse(404, { message: "Cliente no encontrado." }));
    }

    // Validación de stock y precios reales desde BD
       let totalFactura = 0;
    let ivaTotal = 0;
    const detallesProcesados = [];

    // VALIDACIONES Y CALCULOS DE DETALLES
    for (const item of detalles) {
      const [infoProd] = await db.execute(
        `SELECT Pre_Uni, Cant_Dispo, iva_total FROM PRODUCTO WHERE ID = ? AND estado = true`,
        [item.id_producto]
      );

      if (infoProd.length === 0) {
        return res.status(404).json(jsonResponse(404,{ message: `Producto ID ${item.id_producto} no encontrado` }));
      }

      const producto = infoProd[0];

      if (item.cantidad <= 0) {
        return res.status(400).json(jsonResponse(400,{ message: "Cantidad inválida" }));
      }

      if (item.cantidad > producto.Cant_Dispo) {
        return res.status(400).json(jsonResponse(400,{ message: "No hay inventario suficiente" }));
      }

      // calculos
      const subtotal = producto.Pre_Uni * item.cantidad;
      const ivaLinea = subtotal * (producto.iva_total / 100);

      totalFactura += subtotal + ivaLinea;
      ivaTotal += ivaLinea;

      detallesProcesados.push({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: producto.Pre_Uni,
        iva: producto.iva_total,
        iva_val: ivaLinea,
        subtotal
      });
    }

    // Insertar factura
    const [facturaResult] = await db.execute(
      `INSERT INTO FACTURA_VENTA (entregado_a, fecha_registro, total, registrado_por, iva_total)
       VALUES (?, NOW(), ?, ?, ?)`,
      [client[0].Cedula, totalFactura, user[0].Cedula, ivaTotal]
    );

    const facturaId = facturaResult.insertId;

    await Promise.all(detallesProcesados.map((item) =>
      db.execute(
        `INSERT INTO DETALLE_FACT_VEN (id_fact_venta, prod_vend, cant_prod, prec_venta_prod, iva)
         VALUES (?, ?, ?, ?, ?)`,
        [facturaId, item.id_producto, item.cantidad, item.precio_unitario, item.iva]
      )
    ));

    await db.commit();

    return res.status(201).json(jsonResponse(201, { message: "Factura registrada exitosamente" }));
  } catch (error) {
    await db.rollback();
    console.error("Error en creacion de factura:", error);
    return res
      .status(500)
      .json(jsonResponse(500, { message: "Error al registrar la factura" }));
  } finally {
    db.release();
  }
});

export default routerCreateInvoice;
