export interface IProduct {
    Id?: number;
    name: string;
    price: number;
    quantity: number;
    refrigeration_time?: number;
    iva: number;
    registered_by?: string;
    fecha_registro?: string;
    totalLinea?: number;
}