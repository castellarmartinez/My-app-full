const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  ID: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

module.exports = Product;
