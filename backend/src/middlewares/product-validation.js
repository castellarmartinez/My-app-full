const Joi = require("joi");
const Product = require("../models/product");

const ProductSchema = Joi.object({
  ID: Joi.string()
    .pattern(new RegExp(/^[DR]{2}\d/))
    .min(3)
    .required(),

  name: Joi.string()
    .pattern(new RegExp(/^[ a-zA-Z0-9]+$/))
    .min(3)
    .max(32)
    .required(),

  price: Joi.number().min(1).required(),
});

function invalidProductError(message) {
  if (message.includes('"ID"')) {
    return (
      'The products ID must start with "DR" followed' +
      " by at least one number."
    );
  } else if (message.includes('"name"')) {
    return (
      "You must enter a name with a length between " +
      "3-32 characters and only contain letters, numbers and spaces."
    );
  } else if (message.includes('"price"')) {
    return "The price must be a positive number.";
  } else {
    return "The fields you are trying to add are not allowed.";
  }
}
// Middlewares

const tryValidProduct = async (req, res, next) => {
  const product = {
    ID: req.params.id,
    name: req.body.name,
    price: req.body.price,
  };

  try {
    await ProductSchema.validateAsync(product);
    return next();
  } catch (error) {
    return res.status(400).json({
      message: invalidProductError(error.message),
    });
  }
};

const tryRegisteredProduct = async (req, res, next) => {
  try {
    const exist = await Product.findOne({ ID: req.params.id });

    if (exist) {
      return res.status(400).json({
        error: "A product with the same ID already exists.",
      });
    }

    return next();
  } catch (error) {
    return res.status(400).json({
      error: "Unexpected error in registered product.",
    });
  }
};

const tryProductExist = async (req, res, next) => {
  try {
    const exist = await Product.findOne({ ID: req.params.id });

    if (!exist) {
      return res.status(400).json({
        error: "The product you are trying to access" + " does not exist.",
      });
    }

    req.product = exist;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: "Unexpected error in registered product.",
    });
  }
};

module.exports = { tryRegisteredProduct, tryValidProduct, tryProductExist };
