import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './../middleware/ErrorHandler.js';

import userRouter from './routes/user.js';
import loginRouter from './routes/login.js';
import signoutRouter from './routes/signout.js';
import refreshTokenRouter from './routes/refreshToken.js';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors({
   origin: process.env.URLFRONTEND || 'http://localhost:5173',
   credentials: true
}
));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/signout',signoutRouter);
app.use('/api/refresh-token', refreshTokenRouter);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => { 
    console.log(`Backend SurtiPollo UP in port:${port}`)
})