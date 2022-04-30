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
  async (req, res) => {
    const success = await addProduct(req.body, req.params.id);

    if (success) {
      res.status(201).json({
        message: "The product has been added.",
      });
    } else {
      res.status(500).json({
        error: "Unable to add the product.",
      });
    }
  }
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

router.get("/", cacheProducts, async (req, res) => {
  const products = await getProducts();

  if (products) {
    res.status(200).send({
      products,
    });
  } else {
    res.status(500).json({
      error: "Could not access products.",
    });
  }
});

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
  async (req, res) => {
    const success = await updateProduct(req.params.id, req.body);

    if (success) {
      res.status(200).json({
        message: "The product has been updated.",
      });
    } else {
      res.status(500).json({
        error: "Could not update the product.",
      });
    }
  }
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

router.delete(
  "/:id/",
  adminAuthentication,
  tryProductExist,
  async (req, res) => {
    const success = await deleteProduct(req.params.id);

    if (success) {
      res.status(200).json({
        message: "The product has been deleted.",
      });
    } else {
      res.status(500).json({
        error: "Could not delete the product.",
      });
    }
  }
);

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
