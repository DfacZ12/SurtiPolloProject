import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { errorHandler } from './../middleware/ErrorHandler.js';
import {authenticate} from '../middleware/authenticate.js';

import userRouter from './routes/userInfoToken.js';
import loginRouter from './routes/login.js';
import logOutRouter from './routes/logOut.js';
import refreshTokenRouter from './routes/refreshToken.js';
import changePasswordRouter from './routes/changePassword.js';

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

import listProductsRouter from './apis/product/listProducts.js'
import selectProductRouter from './apis/product/selectProduct.js'
import createProductRouter from './apis/product/createProduct.js'
import updateProductRouter from './apis/product/updateProduct.js'
import deleteProductRouter from './apis/product/deleteProduct.js'

import listClientsRouter from './apis/client/listClients.js'
import selectClientRouter from './apis/client/selectClient.js'
import createClientRouter from './apis/client/createClient.js'
import updateClientRouter from './apis/client/updateClient.js'
import deleteClientRouter from './apis/client/deleteClient.js'

import createInvoiceRouter from './apis/invoice/createInvoice.js'
import listInvoiceRouter from './apis/invoice/listInvoice.js'
import selectInvoiceRouter from './apis/invoice/selectInvoice.js'

import forgotPasswordRouter from './apis/email/forgotPassword.js';
import resetPasswordRouter from './apis/email/resetPassword.js';

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
app.use('/api/logOut',logOutRouter);
app.use('/api/userInfoToken', authenticate, userRouter);
app.use('/api/changePassword',authenticate,changePasswordRouter);


//!usuarios
app.use('/api/listUsers',authenticate, listUsersRouter)
app.use('/api/selectUser',authenticate, selectUserRouter)
app.use('/api/createUser', authenticate, createUserRouter)
app.use('/api/updateUser', authenticate, updateUserRouter)
app.use('/api/deleteUser', authenticate, deleteUserRouter)

//!Productos
app.use('/api/listProducts',authenticate, listProductsRouter)
app.use('/api/selectProduct',authenticate, selectProductRouter)
app.use('/api/createProduct', authenticate, createProductRouter)
app.use('/api/updateProduct', authenticate, updateProductRouter)
app.use('/api/deleteProduct', authenticate, deleteProductRouter)

//!Clientes
app.use('/api/listClients',authenticate, listClientsRouter)
app.use('/api/selectClient',authenticate, selectClientRouter)
app.use('/api/createClient', authenticate, createClientRouter)
app.use('/api/updateClient', authenticate, updateClientRouter)
app.use('/api/deleteClient', authenticate, deleteClientRouter)

//!Facturas
app.use('/api/createInvoice', createInvoiceRouter)
app.use('/api/listInvoice',authenticate, listInvoiceRouter)
app.use('/api/selectInvoice',authenticate, selectInvoiceRouter)

//!Email
app.use('/api/forgotPassword', forgotPasswordRouter);
app.use('/api/resetPassword', resetPasswordRouter);

//! EPS
app.use('/api/selectEps',authenticate,epsRouter)

//! Rol
app.use('/api/selectRoles',authenticate,RoleRouter)

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Backend SurtiPollo UP in port:${port}`)
})