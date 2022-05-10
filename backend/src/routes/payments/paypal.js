require("dotenv").config();
const express = require("express");
const router = express.Router();
const paypal = require("@paypal/checkout-server-sdk");

let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

router.post("/pago", async (req, res) => {
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "1600",
        },
      },
    ],
    application_context: {
      return_url: `${process.env.URL_BACK}/paypal/redirect`,
      cancel_url: `${process.env.URL_BACK}/paypal/cancel`,
    },
  });
  client
    .execute(request)
    .then((response) => {
      let { links } = response.result;
      let url = links.filter((link) => link.rel == "approve");

      res.status(response.statusCode).json(url.pop());
    })
    .catch((err) => {
      console.error(err);
      res.status(err.statusCode).json(err);
    });
});

router.get("/redirect", async (req, res) => {
  let { token } = req.query;
  request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});
  client
    .execute(request)
    .then((response) => {
      res.status(200).json(response.result);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.statusCode).json(err);
    });
});

router.get("/cancel", async (req, res) => {
  res.status(200).json(`Payment cancelled`);
});

module.exports = router;
