import express from 'express'
import { jsonResponse } from '../../../lib/jsonResponse.js';
import { connectDB } from '../../../DB/db.js';

const routerSelectEps = express.Router();

export default routerSelectEps.get('/', async (req,res)=>{
  const db = await connectDB();
   try {

    const [info] = await db.execute(
    `SELECT COD_EPS Id,EPS_Nombre Nombre FROM EPS ORDER BY EPS_Nombre`
    );

    if (info.length === 0)return res.status(404).json(jsonResponse(404, { error: 'No hay ninguna EPS registrada' }));


    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener eps:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
})