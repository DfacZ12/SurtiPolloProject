import express from 'express'
import { jsonResponse } from '../../../lib/jsonResponse.js';
import { connectDB } from '../../../DB/db.js';



const routerSelectUser = express.Router();

export default routerSelectUser.get('/', async (req,res)=>{
  const {rol} = req.query
  console.log(rol)
  const db = await connectDB();
   try {

    if(rol !== '1')return res.status(401).json(jsonResponse(401, { error: 'No posee los permisos necesarios.' }));

    const [info] = await db.execute(
    `SELECT a.cedula, a.Nombre, a.Apellido, a.Direccion, b.EPS_Nombre EPS, a.Tel_Fijo, a.Celular,a.Correo,aa.username Registrador_Por,a.username,c.NombreCargo cargo,a.fecha_creacion
    FROM USUARIO a join USUARIO aa on a.cedula=aa.Registrado_Por join EPS b on a.EPS=b.COD_EPS
    join CARGO c on a.cargo=c.id
    WHERE a.estado=true ORDER BY Nombre DESC`
    );

    if (info.length === 0)return res.status(404).json(jsonResponse(404, { error: 'No se encuentran usuarios registrados.' }));


    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
})