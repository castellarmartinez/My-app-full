const Joi = require("joi");
const Address = require("../models/address");
const Order = require("../models/order");
const Payment = require("../models/payment-method");
const Product = require("../models/product");

const OrderSchema = Joi.object({
  payment: Joi.number().min(1).required(),

  quantity: Joi.number().min(1).required(),

  state: Joi.string().valid("open", "closed").required(),

  address: Joi.number().required(),
});

// Funciones usadas para crear los middlewares

function orderErrorMessage(message) {
  if (message.includes('"payment"')) {
    return "You need to use an existing " + "payment method (payment).";
  } else if (message.includes('"state"')) {
    return 'Only "open" and "closed" are valid states' + " for new orders.";
  } else if (message.includes('"quantity"')) {
    return "The product quantity must be greater than 0.";
  } else if (message.includes('"address"')) {
    return "You need to provide an adress.";
  } else {
    return error.message;
  }
}

function stateAdmin(state) {
  switch (state) {
    case "preparing":
    case "shipping":
    case "cancelled":
    case "delivered":
      return true;
    default:
      return false;
  }
}

function stateCustomer(state) {
  switch (state) {
    case "confirmed":
    case "cancelled":
      return true;
    default:
      return false;
  }
}

// Middlewares

const tryOpenOrder = async (req, res, next) => {
  const order = await Order.findOne({ owner: req.user._id, state: "open" });

  if (order) {
    return res.status(409).json({
      error:
        "You can't have more than one open order.\n" +
        "Close or cancel that order to be able to create another order.",
    });
  }

  return next();
};

const tryCanEditOrder = async (req, res, next) => {
  const order = await Order.findOne({ owner: req.user._id, state: "open" });

  if (!order) {
    return res.status(409).json({
      error: "You don't have any open order you can edit.",
    });
  }

  req.order = order;
  return next();
};

const tryValidOrder = async (req, res, next) => {
  try {
    await OrderSchema.validateAsync(req.body);
    const methodExist = await Payment.findOne({ option: req.body.payment });
    const addressExist = await Address.findOne({
      owner: req.user._id,
      option: req.body.address,
    });

    if (!methodExist) {
      throw new Error('"payment"');
    } else if (!addressExist) {
      throw new Error('"address"');
    } else {
      req.payment = methodExist;
      req.address = addressExist;
      return next();
    }
  } catch (error) {
    return res.status(400).json({
      error: orderErrorMessage(error.message),
    });
  }
};

const tryHaveOrders = async (req, res, next) => {
  const orders = await Order.find({ owner: req.user._id });

  if (orders.length <= 0) {
    return res.status(404).json({
      error: "You do not have orders.",
    });
  }

  req.orders = orders;
  return next();
};

const tryValidAddition = async (req, res, next) => {
  const validQuantity = req.query.quantity % 1 === 0 && req.query.quantity > 0;

  if (!validQuantity) {
    return res.status(400).json({
      error: "The units to add must be greater than 0.",
    });
  }

  return next();
};

const tryValidElimination = async (req, res, next) => {
  const validQuantity = req.query.quantity % 1 === 0 && req.query.quantity > 0;

  if (!validQuantity) {
    return res.status(400).json({
      error: "The units to remove must be greater than 0.",
    });
  }

  const product = await Product.findOne({ ID: req.params.id });
  const order = await Order.findOne({
    owner: req.user._id,
    state: "open",
    "products.product": product._id,
  });

  if (!order) {
    return res.status(400).json({
      error:
        "You do not have an open order with the product " +
        "you are trying to remove.",
    });
  }

  req.order = order;
  return next();
};

const tryValidStateCustomer = (req, res, next) => {
  if (!stateCustomer(req.query.state)) {
    return res.status(400).json({
      error:
        "The state could not be changed.\n" +
        'Only "confirmed" and "cancelled" are valid.',
    });
  }

  return next();
};

const tryValidStateAdmin = (req, res, next) => {
  if (!stateAdmin(req.query.state)) {
    return res.status(400).json({
      error:
        "The state could not be changed.\n" +
        'Only "preparing", "shipping", "cancelled" and "delivered" are valid.',
    });
  }

  return next();
};

const tryOrderExist = async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.query.orderId });

  if (!order) {
    return res.status(404).json({
      error: "The order you are trying to edit does not exist.",
    });
  }

  req.order = order;
  return next();
};

module.exports = {
  tryOpenOrder,
  tryValidOrder,
  tryHaveOrders,
  tryCanEditOrder,
  tryValidAddition,
  tryValidElimination,
  tryValidStateCustomer,
  tryValidStateAdmin,
  tryOrderExist,
};
