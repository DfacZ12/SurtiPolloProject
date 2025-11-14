import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/LogoFactura.png";

export const generatePDF = (data: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const factura = data.factura;
  const detalles = data.detalles;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.addImage(logo, "PNG", 15, 10, 30, 30);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  // === ENCABEZADO ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("Factura de Venta", 95, 25);

  // Info de la empresa
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("SurtiPollo S.A.S", 120, 35);
  doc.text("NIT 900.123.456-7", 118, 40);
  doc.text("Tel: (601) 456-7890 - surtpollo@empresa.com", 95, 46);

  const fecha = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("helvetica", "bold");
  doc.text(`Factura n°: ${factura.facturaId || "0001"}`, 15, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha: ${fecha}`, 15, 78);
  doc.text(`Cliente: ${factura.nombre}`, 15, 86);

  // === TABLA ===
  const body = detalles.map((d: any) => [
    `${d.nombre_producto}`,
    d.cantidad.toString(),
    formatCurrency(d.precio_unitario),
    formatCurrency(d.iva),
    formatCurrency(d.precio_unitario * d.cantidad + d.iva),
  ]);

  // === MARCA DE AGUA CENTRAL ===
  doc.saveGraphicsState();
  doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
  try {
    doc.addImage(logo, "PNG", pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(60);
    doc.setTextColor(200);
    doc.text("SURTIPOLLO", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });
  }
  doc.restoreGraphicsState();

  autoTable(doc, {
    startY: 95,
    head: [["Descripción", "Cantidad", "Precio", "IVA", "Total"]],
    body,
    styles: { halign: "center" },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: { fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",
  });

  const finalY = (doc as any).lastAutoTable.finalY || 90;

  // === TOTALES ===
  doc.setFontSize(12);
  doc.text("IVA total:", 150, finalY + 16);
  doc.text(`${formatCurrency(factura.iva_total)}`, 190, finalY + 16, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 150, finalY + 24);
  doc.text(`${formatCurrency(factura.total_factura)}`, 190, finalY + 24, {
    align: "right",
  });

  // === PIE DE PÁGINA ===
  const footerY = pageHeight - 30;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(10, footerY - 5, pageWidth - 10, footerY - 5); // línea separadora

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text("(555) 123-4567", 15, footerY);
  doc.text("ventas@surtipollo.com", 15, footerY + 5);
  doc.text("Calle Principal #123, Ciudad", 15, footerY + 10);

  // === GUARDAR PDF ===
  doc.save(`Factura_${factura.facturaId || "0001"}.pdf`);
};
