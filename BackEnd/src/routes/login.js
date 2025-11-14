import express from 'express';
import { jsonResponse } from '../../lib/jsonResponse.js';
import { connectDB } from '../../DB/db.js';
import bcrypt from 'bcrypt';
import genToken from '../../auth/generateToken.js';
import getInfoUser from  '../../lib/getUserInfo.js'

const routerLogin = express.Router();
export default routerLogin.post('/', async (req, res,next) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json(jsonResponse(400, { error: 'Campos Obligatorios' }));
    try {
        const db = await connectDB();

        const [user] = await db.execute(
        `SELECT a.Cedula,a.username,a.password,a.Nombre,a.Apellido,b.NombreCargo Cargo,a.cargo CargoId, estado,firstLogin
          FROM USUARIO a join CARGO b ON a.Cargo=b.ID WHERE username = ? and estado = true`, [username]
        );

        if (user.length === 0)return res.status(401).json(jsonResponse(401, { error: 'Usuario o Contraseña Incorrectos.' }));

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch)return res.status(401).json(jsonResponse(401, { error: 'Usuario o Contraseña Incorrectos.' }));

        const infoUser = getInfoUser(user[0]);//extrae la info necesaria del usuario
        // Generar access y refresh tokens
        const accessToken = genToken.generateAccessToken(infoUser);
        const refreshToken = genToken.generateRefreshToken(infoUser);
        try{
            await db.execute('UPDATE USUARIO SET refresh_token = ? WHERE Cedula = ?', [refreshToken, infoUser.cc]);
        }catch(error){
          console.error("Error al guardar el refresh token:", error);
          return res.status(500).json(jsonResponse(500,{ error: 'Ha ocurrido un error inesperado, intente de nuevo más tarde.'}))//si hay un error al guardar el refresh token
        }
        return res.status(201).json(jsonResponse(201, {infoUser, accessToken, refreshToken }))//envia el token al cliente
    } catch (error) {
        next(error);
    }
});

