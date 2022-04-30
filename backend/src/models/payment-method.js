const mongoose = require("mongoose");

const pyamentSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },

  option: {
    type: Number,
    unique: true,
  },
});

pyamentSchema.pre("save", async function (next) {
  const method = this;

  if (method.option) {
    return next();
  }

  try {
    const allMethods = await Payment.find({});
    const count = allMethods.length;

    method.option = count + 1;
    return next();
  } catch (error) {
    console.log(error.message);
  }
});

pyamentSchema.post("remove", async function () {
  try {
    const methods = await Payment.find({});

    for (let i = 0; i < methods.length; i++) {
      methods[i].option = i + 1;
      await methods[i].save();
    }
  } catch (error) {
    console.log(error.message);
  }
});

const Payment = mongoose.model("Payment", pyamentSchema);

module.exports = Payment;
