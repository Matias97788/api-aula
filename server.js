const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const crypto = require("crypto");

app.use(bodyParser.json());
app.get("/", (req,res)=>{

}),
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

    // Imprimir todos los valores enviados por el webhook
    console.log("Valores enviados por el webhook:");
    console.log(payload);

    // Responde a Shopify para confirmar la recepción del webhook
    res.sendStatus(200);
  } else {
    // El webhook no es auténtico, responde con un error
    res.sendStatus(401);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
