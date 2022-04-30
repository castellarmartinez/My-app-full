const express = require("express");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/products-controller");
const { adminAuthentication } = require("../middlewares/auth");
const cacheProducts = require("../middlewares/cache");
const {
  tryValidProduct,
  tryRegisteredProduct,
  tryProductExist,
} = require("../middlewares/product-validation");

const router = express.Router();

/**
 * @swagger
 * /products/{productId}:
 *  post:
 *      tags: [Products]
 *      summary: Add a product to the menu.
 *      description: Allow addition of new products.
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
 *                      $ref: '#/components/schemas/addition'
 *      responses:
 *          201:
 *              description: The product was added successfuly.
 *          400:
 *              description: The product data is invalid.
 *          401:
 *              description: You need admin privileges.
 */

router.post(
  "/:id/",
  adminAuthentication,
  tryRegisteredProduct,
  tryValidProduct,
  addProduct
);

/**
 * @swagger
 * /products:
 *  get:
 *      tags: [Products]
 *      summary: Obtain all products in the menu.
 *      description: Return a list of the products.
 *      responses:
 *          200:
 *              description: Succesfully operation.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/productList'
 *          500:
 *              description: Internal error.
 */

router.get("/", cacheProducts, getProducts);

/**
 * @swagger
 * /products/{productId}:
 *  put:
 *      tags: [Products]
 *      summary: Edit a product on the menu.
 *      description: Allow edition of products.
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
 *                      $ref: '#/components/schemas/edition'
 *      responses:
 *          200:
 *              description: Successful operation.
 *          400:
 *              description: Product data is invalid.
 *          401:
 *              description: You need admin privileges to peform this operation.
 */

router.put(
  "/:id/",
  adminAuthentication,
  tryProductExist,
  tryValidProduct,
  updateProduct
);

/**
 * @swagger
 * /products/{productId}:
 *  delete:
 *      tags: [Products]
 *      summary: Delete a product from the menu.
 *      description: Allow elimination of products.
 *      parameters:
 *      -   name: "productId"
 *          in: "path"
 *          required: true
 *          type: "string"
 *      responses:
 *          200:
 *              description: Successful operation.
 *          400:
 *              description: The product you intent to delete, does not exist.
 *          401:
 *              description: You need admin privileges to perform this operation.
 */

router.delete("/:id/", adminAuthentication, tryProductExist, deleteProduct);

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: Products section
 *
 * components:
 *  schemas:
 *      addition:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              price:
 *                  type: integer
 *          example:
 *              name: Changua
 *              price: 3000
 */

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: Products section
 *
 * components:
 *  schemas:
 *      productList:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              precio:
 *                  type: integer
 *              ID:
 *                  type: string
 *          example:
 *              name: Changua
 *              price: 3000
 *              ID: DR153
 */

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: Products section
 *
 * components:
 *  schemas:
 *      edition:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              precio:
 *                  type: integer
 *          example:
 *              name: Ajiaco
 *              price: 500
 */

module.exports = router;
