const Payment = require("../models/payment-method");

const addPaymentMethod = async (method) => {
  try {
    const newMethod = new Payment({ method });
    return await newMethod.save();
  } catch (error) {
    return console.log(error.message);
  }
};

const getPaymentMethods = async () => {
  try {
    return await Payment.find({}).select({ _id: 0, __v: 0 });
  } catch (error) {
    return console.log(error.message);
  }
};

const updatePaymentMethods = async (option, method) => {
  try {
    return await Payment.findOneAndUpdate({ option }, method);
  } catch (error) {
    return console.log(error.message);
  }
};

const deletePaymentMethods = async (payment) => {
  try {
    return await payment.delete();
  } catch (error) {
    return console.log(error.message);
  }
};

module.exports = {
  addPaymentMethod,
  getPaymentMethods,
  updatePaymentMethods,
  deletePaymentMethods,
};
