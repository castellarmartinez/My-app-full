require("dotenv").config();
const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_TOKEN,
});

router.post("/pago", function (req, res) {
  console.log("New request POST to /pago");
  // TODO: protect this route with a middleware

  // TODO: get user data from the database
  const user = {
    name: "Andrea",
    last_name: "Campanella",
    email: "andrea@campanella.com",
  };

  // TODO: get items from the database
  const amount = req.body.amount;
  let items = [
    {
      title: "iPhone 13 Max PRO",
      unit_price: 2000,
      quantity: 5,
    },
    {
      title: "iPad",
      unit_price: 1200,
      quantity: 5,
    },
  ];

  // Crea un objeto de preferencia
  let preference = {
    auto_return: "approved",
    back_urls: {
      success: `${process.env.URL_FRONT}/success`, // TODO: define this
      failure: `${process.env.URL_FRONT}/failure`, // TODO: define this
      pending: `${process.env.URL_FRONT}/pending`, // TODO: define this
    },
    payer: {
      name: user.name,
      surname: user.last_name,
      email: user.email,
    },
    items: items,
  };

  // petición a mercado pago para preparar la compra
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Ok, haga el proceso de pago con este id:
      console.log(response);
      let id = response.body.id;
      res.json({ preference_id: id, url: response.body.sandbox_init_point });
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
