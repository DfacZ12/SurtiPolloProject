import express from 'express'
import { jsonResponse } from '../../../lib/jsonResponse.js';
import { connectDB } from '../../../DB/db.js';



const routerSelectUser = express.Router();

export default routerSelectUser.get('/', async (req,res)=>{
  const db = await connectDB();
   try {

    const [info] = await db.execute(
    `SELECT COD_EPS,EPS_Nombre FROM EPS ORDER BY EPS_Nombre DESC`
    );

    if (info.length === 0)return res.status(404).json(jsonResponse(404, { error: 'No hay ninguna EPS registrada' }));


    res.status(200).json(jsonResponse(200, info));
  } catch (error) {
    console.log("Error al obtener eps:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
})