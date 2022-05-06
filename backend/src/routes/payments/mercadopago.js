require("dotenv").config();
const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_TOKEN,
});

router.get("/success", (req, res) => {
  res.send("Success");
});

router.get("/failure", (req, res) => {
  res.send("Failure");
});

router.get("/pending", (req, res) => {
  res.send("Pending");
});

router.post("/pago", function (req, res) {
  const user = {
    name: "Test",
    email: "test@delilahresto.com",
  };

  let items = [
    {
      title: "Changua",
      unit_price: 16000,
      quantity: 1,
    },
  ];

  let preference = {
    auto_return: "approved",
    back_urls: {
      success: `${process.env.URL_BACK}/mercadopago/success`,
      failure: `${process.env.URL_BACK}/mercadopago/failure`,
      pending: `${process.env.URL_BACK}/mercadopago/pending`,
    },
    payer: {
      name: user.name,
      surname: user.last_name,
      email: user.email,
    },
    items: items,
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      let id = response.body.id;
      res.json({ preference_id: id, url: response.body.sandbox_init_point });
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
