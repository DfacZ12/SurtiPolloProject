import express from 'express';
import { jsonResponse } from '../../lib/jsonResponse.js';

const routerLogin = express.Router();
export default routerLogin.post('/', (req, res) => {
    const {username, password} = req.body;

    if(!!!username || !!!password)return res.status(400).json(jsonResponse(400,{error: 'Campos Obligatorios'}));

    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';
    const user = {
        id: 1, 
        name:'Daniel Acuña',
        username: 'testuser'
    };

    res.status(200)
    .json(jsonResponse(200, {user,accessToken, refreshToken}));
});

// export default router;
