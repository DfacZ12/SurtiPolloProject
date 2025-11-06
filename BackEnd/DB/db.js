import mysql from 'mysql2/promise';
import { jsonResponse } from '../lib/jsonResponse.js';

let connection;

export const connectDB = async () => {
  try{
    if(!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER ,
            password: process.env.DB_PASSWORD ,
            database: process.env.DB_NAME,
            port: process.env.PORTDB ,
        })
    }
    return connection;
  } catch (error) {
    console.log("Error connecting to the database:", error);
    const err = new Error('Ha ocurrido un error, contacte al administrador.');
    err.statusCode = 500;
    err.response = jsonResponse(500, { error: err.message });
    throw err;
  }
}