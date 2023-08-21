const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("¡Hola desde la API de webhooks!");
});

app.post("/webhook/pedidos-pagados", async (req, res) => {
  const payload = req.body;

  // Obtener los datos del pedido
  const orderId = payload.id;
  const orderNumber = payload.order_number;
  const customerName = payload.customer?.first_name + " " + payload.customer?.last_name;
  const customerEmail = payload.email;
  const totalPrice = payload.total_price;


     // Realizar acciones con los datos del pedido y la validación de Thinkific
    console.log("Pedido pagado recibido:");
    console.log("ID del pedido:", orderId);
    console.log("Número de pedido:", orderNumber);
    console.log("Nombre del cliente:", customerName);
    console.log("Email del cliente:", customerEmail);
    console.log("Precio total:", totalPrice);
  
  // Validar si el correo electrónico existe en Thinkific

 const thinkificApiUrl = `https://api.thinkific.com/api/public/v1/users?query%5Bemail%5D=${customerEmail}`;
  
    const response = await axios.get(thinkificApiUrl, {
      headers: {
        'X-Auth-API-Key': 'e8c27c5301d4a56d02f5021893243581',
        'X-Auth-Subdomain': 'academiametrics',
        'Content-Type': 'application/json'
      },
    });
   if(response.data.items > 0){
     console.log("El cliente TIENE una cuenta en Thinkific.");
      console.log(response.data.items);
   }else{
      console.log("El cliente NO TIENE una cuenta en Thinkific.");
          // Agregar alumno a Thinkific
      const createStudentUrl = 'https://api.thinkific.com/api/public/v1/users';

      const studentData = {
        first_name: payload.customer?.first_name,
        last_name: payload.customer?.last_name,
        email: payload.email
        // Otros datos del alumno que deseas proporcionar
      };

      const createResponse = await axios.post(createStudentUrl, studentData, {
        headers: {
          'X-Auth-API-Key': 'e8c27c5301d4a56d02f5021893243581',
          'X-Auth-Subdomain': 'academiametrics',
          'Content-Type': 'application/json'
        },
      });

      console.log("Alumno agregado exitosamente:", createResponse.data);
    

   }
       

    // Responder al webhook con un código 200 para confirmar la recepción
    res.sendStatus(200);

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});