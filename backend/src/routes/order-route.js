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
  async (req, res) => {
    const order = {
      products: [
        {
          product: req.product._id,
          quantity: req.body.quantity,
        },
      ],
      total: req.product.price * req.body.quantity,
      address: req.address,
      payment_method: req.payment,
      state: req.body.state,
      owner: req.user._id,
    };

    const success = await addOrder(order);

    if (success) {
      res.status(201).json({
        message: "The order has been added.",
      });
    } else {
      res.status(500).json({
        error: "Unable to add order.",
      });
    }
  }
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

router.get("/", adminAuthentication, async (req, res) => {
  const orders = await getOrders();

  if (orders) {
    res.status(200).json({
      orders_list: orders,
    });
  } else {
    res.status(500).json({
      error: "Could not access orders.",
    });
  }
});

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

router.get(
  "/history",
  customerAuthentication,
  tryHaveOrders,
  async (req, res) => {
    const ordersDetails = await getOrdersByUser(req.orders);

    if (ordersDetails) {
      res.status(200).json({
        my_orders: ordersDetails,
      });
    } else {
      res.status(500).json({
        error: "Could not access this user's orders.",
      });
    }
  }
);

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
  async (req, res) => {
    const qtyToAdd = parseInt(req.query.quantity, 10);
    const success = await addProductToOrder(req.product, qtyToAdd, req.order);

    if (success) {
      res.status(200).json({
        message: "The product has been added to the order.",
      });
    } else {
      res.status(500).json({
        error: "Could not add the product.",
      });
    }
  }
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
  async (req, res) => {
    const qtyToRemove = parseInt(req.query.quantity, 10);
    const success = await removeProductFromOrder(
      req.product,
      qtyToRemove,
      req.order
    );

    if (success) {
      res.status(200).json({
        message: "The product has been deleted/reduced from the order.",
      });
    } else {
      res.status(500).json({
        error: "Could not delete/reduce the product.",
      });
    }
  }
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
  async (req, res) => {
    const success = await updatePaymentInOrder(req.payment, req.order);

    if (success) {
      res.status(200).json({
        message: "The payment method has been changed.",
      });
    } else {
      res.status(500).json({
        error: "Could not change the payment method.",
      });
    }
  }
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
  async (req, res) => {
    const success = await updateAddress(req.address, req.order);

    if (success) {
      res.status(200).json({
        message: "The address has been updated.",
      });
    } else {
      res.status(500).json({
        error: "Could not change the address.",
      });
    }
  }
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
  async (req, res) => {
    const success = await updateOrderState(req.query.state, req.order);

    if (success) {
      res.status(200).json({
        message: "The order's state has been changed.",
      });
    } else {
      res.status(500).json({
        error: "Could not change the order's state.",
      });
    }
  }
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
  async (req, res) => {
    const success = await updateOrderState(req.query.state, req.order);

    if (success) {
      res.status(200).json({
        message: "The order's state has been changed.",
      });
    } else {
      res.status(500).json({
        error: "Could not change the order's state.",
      });
    }
  }
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
