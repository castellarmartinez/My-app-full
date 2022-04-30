const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },

  option: {
    type: Number,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    select: 0,
  },
});

addressSchema.pre("save", async function (next) {
  const address = this;
  const addresses = await Address.find({ owner: address.owner });
  const length = addresses.length;

  address.option = length + 1;
  return next();
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
