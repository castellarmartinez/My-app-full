const express = require("express");
const {
  addUser,
  getUsers,
  userLogIn,
  userLogOut,
  suspendUser,
  addAddress,
  getAddressList,
} = require("../controllers/users-controller");
const {
  adminAuthentication,
  customerAuthentication,
} = require("../middlewares/auth");
const {
  tryRegisteredUser,
  tryValidUser,
  tryLogin,
  tryLogout,
  tryValidAddress,
  trySuspend,
} = require("../middlewares/user-validation");

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *  post:
 *      tags: [Users]
 *      summary: Register a new user without admin privileges.
 *      description: Allow registering new users.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/register'
 *      responses:
 *          "201":
 *              description: Successful registration.
 *          "400":
 *              description: Registration data is invalid.
 *          "409":
 *              description:  Username or email already in use.
 */

router.post("/register", tryValidUser, tryRegisteredUser, addUser);

/**
 * @swagger
 * /users/login:
 *  post:
 *      tags: [Users]
 *      summary: Access to all registered users.
 *      description: Give access to users.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/login'
 *      responses:
 *          "200":
 *              description: User is now logged in.
 *          "400":
 *              description: User or password is invalid.
 */

router.post("/login", tryLogin, userLogIn);

/**
 * @swagger
 * /users/logout:
 *  post:
 *      tags: [Users]
 *      summary: End session for users.
 *      description: Remove access to an user.
 *      responses:
 *          200:
 *              description: Succesful operation.
 *          400:
 *              description: You need to be logged in.
 */

router.post("/logout", tryLogout, userLogOut);

/**
 * @swagger
 * /users/address:
 *  post:
 *      tags: [Users]
 *      summary: Add new address in the address book.
 *      description: Allow adding a new address.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/addAddress'
 *      responses:
 *          "201":
 *              description: The address has been added.
 *          "500":
 *              description: Error adding a new address.
 */

router.post("/address", customerAuthentication, tryValidAddress, addAddress);

/**
 * @swagger
 * /users:
 *  get:
 *      tags: [Users]
 *      summary: Obtain all accounts registered.
 *      description: Allow to see all accounts.
 *      responses:
 *          200:
 *              description: Successful operation.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/accountsList'
 *          401:
 *              description: You need admin privileges to perform this operation
 */

router.get("/", adminAuthentication, getUsers);

/**
 * @swagger
 * /users/addressbook:
 *  get:
 *      tags: [Users]
 *      summary: Obtain the user's address book
 *      description: Allow to see all user's addresses.
 *      responses:
 *          200:
 *              description: Successful operation.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/addressList'
 *          401:
 *              description: You need to be logged in to perform this operation.
 */

router.get("/addressbook", customerAuthentication, getAddressList);

/**
 * @swagger
 * /users/suspend:
 *  put:
 *      tags: [Users]
 *      summary: Suspend an user.
 *      description: Allow to suspend no-admin users.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/suspend'
 *      responses:
 *          200:
 *              description: Successful operation.
 *          401:
 *              description: You need admin privileges to perform this operation.
 */

router.put("/suspend", adminAuthentication, trySuspend, suspendUser);

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      accountsList:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              username:
 *                  type: string
 *              admin:
 *                  type: boolean
 *          example:
 *              name: Arnedes Olegario
 *              username: arneolegario
 *              admin: false
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      addressList:
 *          type: object
 *          properties:
 *              address:
 *                  type: string
 *              option:
 *                  type: integer
 *          example:
 *              address: Plaza Principal
 *              option: 1
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      logout:
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      login:
 *          type: object
 *          requred:
 *              -email
 *              -password
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *          example:
 *              email: olegario@delilahresto.com
 *              password: Olegax007
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      addAddress:
 *          type: object
 *          requred:
 *              -address
 *          properties:
 *              address:
 *                  type: string
 *          example:
 *              address: calle 26#35-12
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      register:
 *          type: object
 *          requred:
 *              -name
 *              -username
 *              -password
 *              -email
 *              -phone
 *          properties:
 *              name:
 *                  type: string
 *                  description: Full name
 *              username:
 *                  type: string
 *                  description: username
 *              password:
 *                  type: string
 *                  description: password
 *              email:
 *                  type: string
 *                  description: email
 *              phone:
 *                  type: integer
 *                  description: phone
 *          example:
 *              name: Arnedes Olegario
 *              username: arneolegario
 *              password: Olegax007
 *              email: olegario@delilahresto.com
 *              phone: 3735648623
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users section
 *
 * components:
 *  schemas:
 *      suspend:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *          example:
 *              email: user@delilahresto.com
 */

module.exports = router;
