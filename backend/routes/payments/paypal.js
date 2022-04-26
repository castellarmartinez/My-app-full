const express = require("express");
const router = express.Router();
require("dotenv").config();

// 1) Configuarionces del Paypal

// SDK de PayPal
const paypal = require("@paypal/checkout-server-sdk");

// Agrega credenciales
// se usa SandboxEnvironment. Para producción, usar LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

// 2) Endpoints de paypal como tal

//2.1. Crea orden de pago
//2.2 Devuelve el link de pago
router.post("/pago", async (req, res) => {
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
    application_context: {
      return_url: `${process.env.URL_BACK}/paypal/redirect`, //se define la url de regreso si se completó el pago -> 3.
      cancel_url: `${process.env.URL_BACK}/paypal/cancel`, //se define la url de regreso si se quiere cancelar -> 4.
    },
  });
  client
    .execute(request)
    .then((response) => {
      let { links } = response.result;
      console.log(links);
      let url = links.filter((link) => link.rel == "approve");
      res.status(response.statusCode).json(url.pop());
    })
    .catch((err) => {
      console.error(err);
      res.status(err.statusCode).json(err);
    });
});

//2.3.  Cuando el pago se completa, se obtiene el token para capturar el pago del comprador
router.get("/redirect", async (req, res) => {
  let { token } = req.query;
  request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});
  client
    .execute(request)
    .then((response) => {
      console.log(response.result);
      //TO DO
      //Redireccionar al front para mostrar el estado de la transacion
      res.status(200).json(response.result);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.statusCode).json(err);
    });
});

//2.4. Cuando se cancela, se redirige acá
router.get("/cancel", async (req, res) => {
  console.log(`Payment cancelled`);
  res.status(200).json(`Payment cancelled`);
});

// 3) Exportamos los endpoints del router

module.exports = router;
