import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRouter from './routes/user.js';
import loginRouter from './routes/login.js';
import signoutRouter from './routes/signout.js';
import refreshTokenRouter from './routes/refreshToken.js';

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const main = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log('Connected to MongoDB');
}

main().catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/signout',signoutRouter);
app.use('/api/refresh-token', refreshTokenRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => { 
})