require("dotenv").config();
const express = require("express");
const router = express.Router();
const mercadopago = require("./mercadopago");
const paypal = require("./paypal");

//Este endpoint es de prueba nada mas
router.get("/pruebapago", function (req, res) {
  console.log("New request POST to /pruebapago");

  let data = {
    success: true,
    message: `User ${req.body.name} registered correctly`,
    data: req.body,
  };

  res.json(data);
});

router.use("/mercadopago", mercadopago);
router.use("/paypal", paypal);

module.exports = router;
