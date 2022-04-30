const Payment = require("../models/payment-method");

const addPaymentMethod = async (req, res) => {
  const method = req.body.method;
  const newMethod = new Payment({ method });

  try {
    await newMethod.save();

    res.status(201).json({
      message: "The payment method has been added.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Unable to add the payment method.",
    });
  }
};

const getPaymentMethods = async (req, res) => {
  try {
    const methods = await Payment.find({}).select({ _id: 0, __v: 0 });

    res.status(200).json({
      payment_methods: methods,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not access payment methods.",
    });
  }
};

const updatePaymentMethods = async (req, res) => {
  const option = req.params.id;
  const update = { method: req.body.method };

  try {
    await Payment.findOneAndUpdate({ option }, update);

    res.status(200).json({
      message: "The payment method has been updated.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not update the payment method.",
    });
  }
};

const deletePaymentMethods = async (req, res) => {
  const payment = req.payment;

  try {
    await payment.delete();

    res.status(200).json({
      message: "The payment method has been deleted.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not delete the payment method.",
    });
  }
};

module.exports = {
  addPaymentMethod,
  getPaymentMethods,
  updatePaymentMethods,
  deletePaymentMethods,
};
