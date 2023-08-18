const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("¡Hola desde la API de webhooks!");
});

app.post("/webhook/pedidos-pagados", (req, res) => {
  const payload = req.body;

  // Obtener los datos del pedido
  const orderId = payload.id;
  const orderNumber = payload.order_number;
  const customerEmail = payload.email;
  const totalPrice = payload.total_price;
 const customerName = payload.customer?.first_name + " " + payload.customer?.last_name;
  // Realizar acciones con los datos del pedido
  console.log("Pedido pagado recibido:");
  console.log("ID del pedido:", orderId);
  console.log("Número de pedido:", orderNumber);
  console.log("Email del cliente:", customerEmail);
  console.log("Nombre:", customerName)
  console.log("Precio total:", totalPrice);

  // Responder al webhook con un código 200 para confirmar la recepción
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});