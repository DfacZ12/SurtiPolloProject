import { Resend } from "resend";


export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const resend = new Resend(process.env.RESEND_KEY);

    const info = await resend.emails.send({
      from: "Soporte <onboarding@resend.dev>",
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
    return true;

  } catch (error) {
    console.error("Error enviando email:", error);
    throw new Error("No se pudo enviar el correo de recuperación");
  }
};