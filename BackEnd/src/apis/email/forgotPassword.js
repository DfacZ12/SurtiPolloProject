import express from "express";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../DB/db.js";
import { jsonResponse } from "../../../lib/jsonResponse.js";
import { sendResetPasswordEmail } from "./sendResetPasswordEmail.js";

const routerForgotPassword = express.Router();

routerForgotPassword.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const db = await connectDB();

    const [rows] = await db.execute(
      "SELECT Cedula FROM USUARIO WHERE Correo = ?",
      [email]
    );

    // Siempre responder 200 para evitar enumeración
    if (rows.length === 0) {
      return res.status(200).json(
        jsonResponse(200, {
          message: "Si el correo existe, se enviará un enlace para restablecer la contraseña."
        })
      );
    }

    const user = rows[0];
    console.log(user);

    const token = jwt.sign(
      {
        Cedula: user.Cedula,
        type: "password_reset"
      },
      process.env.JWT_KEY,
      { expiresIn: "10m" }
    );

    // aquí envías el email
    const resetLink = `http://localhost:5173/ResetPassword?token=${token}`;
    await sendResetPasswordEmail(email, resetLink);

    res.status(200).json(
      jsonResponse(200, {
        message: "Si el correo existe, se enviará un enlace para restablecer la contraseña."
      })
    );

  } catch (error) {
    console.error(error);
    res.status(500).json(jsonResponse(500, { error: "Error en servidor" }));
  }
});

export default routerForgotPassword;
