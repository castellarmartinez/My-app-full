const Joi = require("joi");
const Payment = require("../models/payment-method");

const PaymentSchema = Joi.object({
  method: Joi.string().min(3).max(32).required(),
});

function paymentErrorMessage(message) {
  if (message.includes('"method"')) {
    return (
      "The method's name must have a length between " +
      "3-32 characters and only contain letters, numbers and spaces."
    );
  } else {
    return "The fields you are trying to add are not allowed.";
  }
}

// Middlewares

const tryValidMethod = async (req, res, next) => {
  try {
    await PaymentSchema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({
      error: paymentErrorMessage(error.message),
    });
  }
};

const tryMethodUpdate = async (req, res, next) => {
  try {
    const exist = await Payment.findOne({ option: req.params.id });

    if (!exist) {
      return res.status(400).json({
        error:
          "The method you are trying to update" + "/delete does not exist.",
      });
    }

    req.payment = exist;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: "Unexpected error in registered method.",
    });
  }
};

module.exports = { tryValidMethod, tryMethodUpdate };
