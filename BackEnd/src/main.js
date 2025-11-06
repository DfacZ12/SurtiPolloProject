import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { errorHandler } from './../middleware/ErrorHandler.js';
import {authenticate} from '../middleware/authenticate.js';

import userRouter from './routes/userInfoToken.js';
import loginRouter from './routes/login.js';
import signoutRouter from './routes/signout.js';
import refreshTokenRouter from './routes/refreshToken.js';

/**
 * APIS
 */
import selectUSerRouter from './apis/user/selectUser.js'
import epsRouter from './apis/eps/selectEps.js'
// import RoleRouter from './apis/user/selectRole.js'


const app = express();


const port = process.env.PORT || 3000;

app.use(cors({
   origin: process.env.URLFRONTEND || 'http://localhost:5173',
   credentials: true
}
));
app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/refreshToken', refreshTokenRouter);
app.use('/api/userInfoToken', authenticate, userRouter);
app.use('/api/signout',signoutRouter);//! Pendiente Por realizar endpoint de signout
app.use('/api/selectUser', selectUSerRouter)//!Hace falta poner el middleware
app.use('/api/selectEps',epsRouter)
// app.use('/api/selectRoles',RoleRouter)

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Backend SurtiPollo UP in port:${port}`)
})