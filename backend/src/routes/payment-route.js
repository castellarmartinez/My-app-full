const express = require("express");
const {
  addPaymentMethod,
  getPaymentMethods,
  updatePaymentMethods,
  deletePaymentMethods,
} = require("../controllers/payments-controller");
const {
  adminAuthentication,
  userAuthentication,
} = require("../middlewares/auth");
const {
  tryMethodUpdate,
  tryValidMethod,
} = require("../middlewares/payment-validation");

const router = express.Router();

/**
 * @swagger
 * /payment:
 *  post:
 *      tags: [Payment methods]
 *      summary: Add a new payment method.
 *      description: Allow addition of new payment methods.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/newPayment'
 *      responses:
 *          201:
 *              description: The payment method was added succesfully.
 *          400:
 *              description: The payment method could not be added.
 *          401:
 *              description: You need admin privileges to perform this operation.
 */

router.post("/", adminAuthentication, tryValidMethod, addPaymentMethod);

/**
 * @swagger
 * /payment:
 *  get:
 *      tags: [Payment methods]
 *      summary: Obtain all payment methods.
 *      description: Allow to see all payment methods.
 *      responses:
 *          200:
 *              description: Successful operation.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/medios de pago'
 *          401:
 *              description:  You need to be authenticate to perform this operation.
 */

router.get("/", userAuthentication, getPaymentMethods);

/**
 * @swagger
 * /payment/{option}:
 *  put:
 *      tags: [Payment methods]
 *      summary: Update a payment method.
 *      description: Allow edition of a payment method.
 *      parameters:
 *      -   name: "option"
 *          in: "path"
 *          required: true
 *          type: "integer"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/newPayment'
 *      responses:
 *          200:
 *              description: Successful operation.
 *          400:
 *              description: The product data is invalid.
 *          401:
 *              description: You need admin privileges to perform this operation.
 */

router.put(
  "/:id/",
  adminAuthentication,
  tryMethodUpdate,
  tryValidMethod,
  updatePaymentMethods
);

/**
 * @swagger
 * /payment/{option}:
 *  delete:
 *      tags: [Payment methods]
 *      summary: Delete a payment method.
 *      description: Allow elimination of a pyament method.
 *      parameters:
 *      -   name: "option"
 *          in: "path"
 *          required: true
 *          type: "integer"
 *      responses:
 *          200:
 *              description: Successful operation.
 *          400:
 *              description: The product data is invalid.
 *          401:
 *              description: You need admin privileges to perform this operation.
 */

router.delete(
  "/:id/",
  adminAuthentication,
  tryMethodUpdate,
  deletePaymentMethods
);

/**
 * @swagger
 * tags:
 *  name: Payment methods
 *  description: Payment section
 *
 * components:
 *  schemas:
 *      medios de pago:
 *          type: object
 *          properties:
 *              method:
 *                  type: string
 *              option:
 *                  type: integer
 *          example:
 *              method: Tarjeta de crédito
 *              option: 1
 */

/**
 * @swagger
 * tags:
 *  name: Payment methods
 *  description: Payment section
 *
 * components:
 *  schemas:
 *      newPayment:
 *          type: object
 *          properties:
 *              method:
 *                  type: string
 *          example:
 *              method: Tarjeta de débito
 */

module.exports = router;
