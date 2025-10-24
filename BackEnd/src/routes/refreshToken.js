import express from 'express';
import { jsonResponse } from '../../lib/jsonResponse.js';
import { connectDB } from '../../DB/db.js';
import getTokenFromHeader from '../../auth/getTokenFromHeader.js';
import verifyTokens from '../../auth/verifyTokens.js';
import genToken from '../../auth/generateToken.js';

const router = express.Router();

export default router.post('/', async (req, res,next) => {
  const refreshToken = getTokenFromHeader(req.headers);
  if(!refreshToken){
    res.status(401).send(jsonResponse(401, { error: 'Unauthorized' }));
    return
  }
  try {
    const db = await connectDB();
    const [foundRfTk] = await db.execute('SELECT refresh_token FROM USUARIO WHERE refresh_token = ?', [refreshToken]);
    if(foundRfTk.length === 0){
      return res.status(401).send(jsonResponse(401, { error: 'Unauthorized' }));
    }
    console.log("Refresh token encontrado en DB:", foundRfTk[0].refresh_token);
    const payload = verifyTokens.verifyRefreshToken(foundRfTk[0].refresh_token);

    if(!payload)return res.status(401).send(jsonResponse(401, { error: 'Unauthorized' }));

    const accessToken = genToken.generateAccessToken(payload.data);
    console.log("Nuevo access token generado:", payload.data);
    return res.status(201).json(jsonResponse(201, { accessToken: accessToken }));

  } catch (error) {
    console.log("Error en refresh token:", error);
    next(error);
  }

});

