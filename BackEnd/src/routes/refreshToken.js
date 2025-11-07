import express from "express";
import { jsonResponse } from "../../lib/jsonResponse.js";
import { connectDB } from "../../DB/db.js";
import verifyTokens from "../../auth/verifyTokens.js";
import genToken from "../../auth/generateToken.js";
import getInfoUSer from  '../../lib/getUserInfo.js'

const router = express.Router();

router.post("/", async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(jsonResponse(401, { error: "No token provided" }));
  }

  const refreshToken = authHeader.split(" ")[1];

  try {
    //Verificar firma/expiración del refresh token
    const decoded = verifyTokens.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json(jsonResponse(403, { error: "Invalid or expired refresh token" }));
    }

    const db = await connectDB();
    const [userRows] = await db.execute(
      `SELECT a.Cedula,a.username,a.Nombre,a.Apellido,b.NombreCargo Cargo,a.cargo CargoId
          FROM USUARIO a join CARGO b ON a.Cargo=b.ID WHERE refresh_token = ?`,
      [refreshToken]
    );

    if (userRows.length === 0) {
      return res.status(403).json(jsonResponse(403, { error: "Refresh token not found in DB" }));
    }

    const user = userRows[0];
    const infoUser = getInfoUSer(user)

    //Generar nuevos tokens
    const newAccessToken = genToken.generateAccessToken(infoUser);
    const newRefreshToken = genToken.generateRefreshToken(infoUser);

    //Guardar nuevo refresh token en DB
    await db.execute("UPDATE USUARIO SET refresh_token = ? WHERE Cedula = ?", [
      newRefreshToken,
      infoUser.cc,
    ]);


    return res.status(201).json(
      jsonResponse(201, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );
  } catch (err) {
    console.log("Error in /refresh-token:", err);
    next(err);
  }
});

export default router;
