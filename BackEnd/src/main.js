import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { errorHandler } from './../middleware/ErrorHandler.js';
import {authenticate} from '../middleware/authenticate.js';

import userRouter from './routes/userInfoToken.js';
import loginRouter from './routes/login.js';
import logOutRouter from './routes/logOut.js';
import refreshTokenRouter from './routes/refreshToken.js';

/**
 * APIS
 */
import epsRouter from './apis/eps/selectEps.js'
import RoleRouter from './apis/rol/selectRole.js'

import listUsersRouter from './apis/user/listUsers.js'
import selectUserRouter from './apis/user/selectUser.js'
import createUserRouter from './apis/user/createUser.js'
import updateUserRouter from './apis/user/updateUser.js'
import deleteUserRouter from './apis/user/deleteUser.js'


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
app.use('/api/logOut',logOutRouter);


//!usuarios
app.use('/api/listUsers',authenticate, listUsersRouter)
app.use('/api/SelectUser',authenticate,selectUserRouter)
app.use('/api/createUser', authenticate,createUserRouter)
app.use('/api/updateUser', authenticate,updateUserRouter)
app.use('/api/deleteUser', authenticate,deleteUserRouter)


//! EPS
app.use('/api/selectEps',authenticate,epsRouter)

//! Rol
app.use('/api/selectRoles',authenticate,RoleRouter)

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Backend SurtiPollo UP in port:${port}`)
})