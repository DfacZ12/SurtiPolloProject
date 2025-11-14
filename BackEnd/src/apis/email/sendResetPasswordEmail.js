import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Soporte - SurtiPollo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Restablece tu contraseña",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Restablecer contraseña</h2>
          <p>Has solicitado recuperar tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>

          <a href="${resetLink}"
             style="background: #4e73df; color: white; padding: 12px 22px;
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Restablecer contraseña
          </a>

          <p style="margin-top: 20px;">Este enlace expirará en 10 minutos.</p>

          <p>Si no solicitaste esta acción, puedes ignorar este correo.</p>
        </div>
      `
    });

    console.log("📧 Email enviado:", info.messageId);
    return true;

  } catch (error) {
    console.error("Error enviando email:", error);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
};
