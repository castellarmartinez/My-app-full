const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  token: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 8);
  }

  if (user.isModified("name")) {
    user.name = user.name.toLowerCase();
    user.name = user.name.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
