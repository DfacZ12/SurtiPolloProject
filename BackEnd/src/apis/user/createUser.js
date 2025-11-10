import express from "express";
import bcrypt from "bcrypt";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { connectDB } from "../../../DB/db.js";
import { authorizeRole } from "../../../auth/authRoles.js";

const routerCreateUser = express.Router();

// 🧩 Función auxiliar para generar una contraseña aleatoria
const generateRandomPassword = (length = 10) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

routerCreateUser.post("/", async (req, res) => {
  const { name, lname, cedula, direccion, email, number, phone, eps, cargo, username,registered_by } = req.body;

  if (!name || !lname || !cedula || !direccion || !email || !number || !cargo || !username || !registered_by) {
    return res.status(400).json(jsonResponse(400, { message: "Faltan campos obligatorios." }));
  }

  try {
    const db = await connectDB();

    // Verificar si el usuario ya existe
    const [existing] = await db.execute(`SELECT * FROM USUARIO WHERE username = ? OR cedula = ?`, [username, cedula]);
    if (existing.length > 0) {
      return res.status(409).json(jsonResponse(409, { message: "El usuario o cédula ya están registrados." }));
    }

    const [ccUser] = await db.execute(`SELECT cedula FROM USUARIO WHERE username = ? `, [registered_by]);
    if(ccUser.length ==0)return res.status(409).json(jsonResponse(409, { message: "Error al registar el usaurio." }));

    console.log(ccUser)
    // Generar contraseña aleatoria y encriptarla
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    // Insertar el nuevo usuario
    await db.execute(
      `INSERT INTO USUARIO (Cedula, Nombre, Apellido, Direccion, Celular, Tel_Fijo,Correo, EPS, cargo, Registrado_Por,username, password, estado, firstLogin, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,NOW())`,
      [cedula, name, lname, direccion, number, phone || null, email, eps, cargo, ccUser[0].cedula, username, hashedPassword, true, true]
    );

    // Retornar la contraseña generada (idealmente solo visible para admin o enviada por correo)
    res.status(201).json(
      jsonResponse(201, {
        message: "Usuario creado exitosamente.",
        tempPassword: plainPassword,
        note: "El usuario deberá cambiar su contraseña al iniciar sesión por primera vez.",
      })
    );
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json(jsonResponse(500, { message: "Error interno del servidor." }));
  }
});

export default routerCreateUser;
