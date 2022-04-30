const express = require("express");
const {
  addOrder,
  getOrders,
  getOrdersByUser,
  addProductToOrder,
  removeProductFromOrder,
  updatePaymentInOrder,
  updateOrderState,
  updateAddress,
} = require("../controllers/orders-controller");
const {
  customerAuthentication,
  adminAuthentication,
} = require("../middlewares/auth");
const {
  tryOpenOrder,
  tryValidOrder,
  tryHaveOrders,
  tryCanEditOrder,
  tryValidAddition,
  tryValidElimination,
  tryValidStateCustomer,
  tryValidStateAdmin,
  tryOrderExist,
} = require("../middlewares/order-validation");
const { tryMethodUpdate } = require("../middlewares/payment-validation");
const { tryProductExist } = require("../middlewares/product-validation");
const { tryAddressExist } = require("../middlewares/user-validation");

const router = express.Router();

/**
 * @swagger
 * /orders/{productId}:
 *  post:
 *      tags: [Orders]
 *      summary: Make an order.
 *      description: Allow addition of new orders.
 *      parameters:
 *      -   name: "productId"
 *          in: "path"
 *          required: true
 *          type: "string"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/add'
 *      responses:
 *          201:
 *              description: Order created.
 *          400:
 *              description: Order data is invalid.
 *          403:
 *              description: You need to be authenticate to perform this operation.
 *          409:
 *              description: You have an open order.
 *          500:
 *              description: Internal error.
 */

router.post(
  "/:id/",
  customerAuthentication,
  tryProductExist,
  tryOpenOrder,
  tryValidOrder,
  addOrder
);

/**
 * @swagger
 * /orders:
 *  get:
 *      tags: [Orders]
 *      summary: Obtain all orders.
 *      description: Allow to see all orders.
 *      parameters: []
 *      responses:
 *          200:
 *              description: Successful operation.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/list'
 *          403:
 *              description: You need admin privilages to perform this operation.
 *          500:
 *              description: Internal error.
 */

router.get("/", adminAuthentication, getOrders);

/**
 * @swagger
 * /orders/history:
 *  get:
 *      tags: [Orders]
 *      summary: Obtain all orders made by an user.
 *      description: Allow to see all user's orders.
 *      parameters: []
 *      responses:
 *          200:
 *              description: Successful operation.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/history'
 *          403:
 *              description: You need to be logged in as a customer.
 *          404:
 *              description: You do not have orders.
 *          500:
 *              description: Internal error.
 */

router.get("/history", customerAuthentication, tryHaveOrders, getOrdersByUser);

/**
 * @swagger
 * /orders/addProduct/{productId}:
 *  put:
 *      tags: [Orders]
 *      summary: Add a new product to an order.
 *      description: Allow addition of a new product in the order.
 *      parameters:
 *      -   name: "productId"
 *          in: "path"
 *          required: true
 *      -   name: "quantity"
 *          in: "query"
 *          required: true
 *      responses:
 *          200:
 *              description: Succesful operation.
 *          400:
 *              description: Order data is invalid.
 *          401:
 *              description: You need to be logged in as a customer.
 *          409:
 *              description: You cannot edit orders.
 *          500:
 *              description: Internal error.
 */

router.put(
  "/addProduct/:id/",
  customerAuthentication,
  tryCanEditOrder,
  tryProductExist,
  tryValidAddition,
  addProductToOrder
);

/**
 * @swagger
 * /orders/removeProduct/{productId}:
 *  put:
 *      tags: [Orders]
 *      summary: Delete a product from an order.
 *      description: Allow elimination of products in an order.
 *      parameters:
 *      -   name: "productId"
 *          in: "path"
 *          required: true
 *      -   name: "quantity"
 *          in: "query"
 *          required: true
 *      responses:
 *          200:
 *              description: Succesful operation.
 *          400:
 *              description: Order data is invalid.
 *          401:
 *              description: You need to be logged in as a customer.
 *          409:
 *              description: You cannot edit orders.
 *          500:
 *              description: Internal error.
 */

router.put(
  "/removeProduct/:id/",
  customerAuthentication,
  tryCanEditOrder,
  tryProductExist,
  tryValidElimination,
  removeProductFromOrder
);

/**
 * @swagger
 * /orders/payment/{option}:
 *  put:
 *      tags: [Orders]
 *      summary: Change payment method in an order.
 *      description: Allow changing the payment method in an order.
 *      parameters:
 *      -   name: "option"
 *          in: "path"
 *          required: true
 *      responses:
 *          200:
 *              description: Succesful operation.
 *          400:
 *              description: Order data is invalid.
 *          401:
 *              description: You need to be logged in as a customer.
 *          409:
 *              description: You cannot edit orders.
 *          500:
 *              description: Internal error.
 */

router.put(
  "/payment/:id",
  customerAuthentication,
  tryCanEditOrder,
  tryMethodUpdate,
  updatePaymentInOrder
);

/**
 * @swagger
 * /orders/address:
 *  put:
 *      tags: [Orders]
 *      summary: Change orders address.
 *      description: Allow changing the address in an order.
 *      parameters:
 *      -   name: "option"
 *          in: "query"
 *          required: true
 *      responses:
 *          200:
 *              description: Succesful operation.
 *          400:
 *              description: Order data is invalid.
 *          401:
 *              description: You need to be logged in as a customer.
 *          409:
 *              description: You cannot edit orders.
 *          500:
 *              description: Internal error.
 */

router.put(
  "/address",
  customerAuthentication,
  tryCanEditOrder,
  tryAddressExist,
  updateAddress
);

/**
 * @swagger
 * /orders/state/customer:
 *  put:
 *      tags: [Orders]
 *      summary: Change the state in an order.
 *      description: Allow changing the state in an order.
 *      parameters:
 *      -   name: "state"
 *          in: "query"
 *          required: true
 *          type: "array"
 *          items:
 *          schema:
 *              type: "string"
 *              enum:
 *              -   "confirmed"
 *              -   "cancelled"
 *      responses:
 *          200:
 *              description: Successful operation.
 *          401:
 *              description: You need to be logged in as a customer.
 *          409:
 *              description: You cannot edit orders.
 *          500:
 *              description: Internal error.
 */

router.put(
  "/state/customer",
  customerAuthentication,
  tryCanEditOrder,
  tryValidStateCustomer,
  updateOrderState
);

/**
 * @swagger
 * /orders/state/admin:
 *  put:
 *      tags: [Orders]
 *      summary: Change the state or the orders as an admin.
 *      description: Allow changin the state of the orders.
 *      parameters:
 *      -   name: "orderId"
 *          in: "query"
 *          required: true
 *          type: "string"
 *      -   name: "state"
 *          in: "query"
 *          required: true
 *          type: "array"
 *          items:
 *          schema:
 *              type: "string"
 *              enum:
 *              -   "preparing"
 *              -   "shipping"
 *              -   "cancelled"
 *              -   "delivered"
 *      responses:
 *          200:
 *              description: Successful operation.
 *          401:
 *              description: You need admin privileges to perform this operation.
 *          500:
 *              description: Internal error.
 */

router.put(
  "/state/admin",
  adminAuthentication,
  tryOrderExist,
  tryValidStateAdmin,
  updateOrderState
  );

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Orders section
 *
 * components:
 *  schemas:
 *      list:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *              phone:
 *                  type: integer
 *              address:
 *                  type: string
 *              total:
 *                  type: integer
 *              payment:
 *                  type: string
 *              order:
 *                  type: string
 *              state:
 *                  type: string
 *          example:
 *              name: Pancracio Anacleto
 *              username: panacleto
 *              email: señorpancracio@nubelar.com
 *              phone: 4630107
 *              address: Calle los ahogados
 *              description: 1xArepa 3xPandebonos
 *              total: 36000
 *              payment: Efectivo
 *              order: '#16'
 *              state: confirmado
 */

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Orders section
 *
 * components:
 *  schemas:
 *      history:
 *          type: object
 *          properties:
 *              total:
 *                  type: integer
 *              payment:
 *                  type: string
 *              order:
 *                  type: string
 *              state:
 *                  type: string
 *          example:
 *              address: Calle los ahogados
 *              description: 1xArepa 3xPandebonos
 *              total: 36000
 *              payment: Efectivo
 *              order: '#16'
 *              state: confirmado
 */

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Orders section
 *
 * components:
 *  schemas:
 *      add:
 *          type: object
 *          properties:
 *              qunatity:
 *                  type: integer
 *              payment:
 *                  type: integer
 *              state:
 *          example:
 *              quantity: 5
 *              payment: 2
 *              address: 1
 *              state: open
 */

module.exports = router;
