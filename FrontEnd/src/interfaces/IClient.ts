export interface IClient {
  cedula: number,
  name: string,
  lname: string,
  Tel_Fijo?: number | null,
  Celular: string,
  Direccion: string,
  Correo: string,
  Registered_by: string,
  fecha_registro: Date
}