const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("¡Hola desde la API!");
});

app.post("/webhook/pedidos-pagados", (req, res) => {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  const webhookSecret =
    "2aa3ca75fbda6ca3e0abe8f89c312d37f536082f3a68ccf18f5c55dc8c66c363";

  const hash = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("base64");

  if (hash === hmacHeader) {
    // La firma HMAC coincide, el webhook es auténtico
    const payload = req.body;

    // Almacenar los valores enviados por el webhook en una variable
    const payloadString = JSON.stringify(payload);

    // Responde a Shopify para confirmar la recepción del webhook
    res.sendStatus(200);

    // Imprimir el payload en la consola
    console.log("Valores enviados por el webhook:");
    console.log(payload);

    // Enviar notificación por correo electrónico
    enviarNotificacion(payload);

    // Retornar el payload como respuesta
    return payloadString;
  } else {
    // El webhook no es auténtico, responde con un error
    res.sendStatus(401);
  }
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

async function enviarNotificacion(payload) {
  try {
    // Configurar el transporte de correo electrónico
    const transporter = nodemailer.createTransport({
      // Aquí debes configurar tus datos de servidor de correo saliente (SMTP)
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: "matigoldercazar@gmail.com",
        pass: "matigolacdc",
      },
    });

    // Configurar el contenido del correo electrónico
    const mensaje = {
      from: "noreply@example.com",
      to: "m.rodriguez@agencialosnavegantes.cl",
      subject: "Notificación de Webhook",
      text: JSON.stringify(payload),
    };

    // Enviar el correo electrónico
    const info = await transporter.sendMail(mensaje);
    console.log("Correo electrónico enviado:", info.response);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
}