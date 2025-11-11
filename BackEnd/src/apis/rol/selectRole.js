import express from 'express'
import { jsonResponse } from '../../../lib/jsonResponse.js';
import { connectDB } from '../../../DB/db.js';



const routerSelectRoles = express.Router();

export default routerSelectRoles.get('/', async (req,res)=>{
  const db = await connectDB();
   try {

    const [info] = await db.execute(
    `SELECT Id,NombreCargo Nombre FROM CARGO ORDER BY NombreCargo`
    );

    if (info.length === 0)return res.status(404).json(jsonResponse(404, { error: 'No hay ningun Rol Registrado.' }));


    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
})