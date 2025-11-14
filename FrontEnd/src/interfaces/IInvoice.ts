export interface IInvoice {
  factura: invoiceData;
  detalles: invoiceDetail[];
}

interface invoiceData {
  cedula: number;
  total_factura: number;
  iva_total: number;
  registered_by?: string;
}

interface invoiceDetail {
  id_producto:number;
  cantidad:number;
  precio_unitario:number;
  iva: number
}

export interface IListInvoice {
  id_factura: number;
  cedula: string;
  cliente: string;
  fecha_registro: string;
  total: string;
  iva_total: string;
  registrado_por: string;
}