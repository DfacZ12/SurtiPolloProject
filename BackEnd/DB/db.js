import mysql from 'mysql2/promise';
import { jsonResponse } from '../lib/jsonResponse.js';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORTDB,
};


let connection;
let pool;

export const connectDB = async () => {
  try{
    if(!connection) {
        connection = await mysql.createConnection(dbConfig);
    }
    return connection;
  } catch (error) {
    const err = new Error('Ha ocurrido un error, contacte al administrador.');
    err.statusCode = 500;
    err.response = jsonResponse(500, { error: err.message });
    throw err;
  }
}

export const getPool = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool(dbConfig);
    }
    return pool;
  } catch (error) {
    console.error("Error creando el pool:", error);
    throw error;
  }
};

export const createTransactionConnection = async () => {
  try {
    const poolConn = await getPool();
    const conn = await poolConn.getConnection();
    return conn;
  } catch (error) {
    console.error("Error creando conexión de transacción:", error);
    throw error;
  }
};

