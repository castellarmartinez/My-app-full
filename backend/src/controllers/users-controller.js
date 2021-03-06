const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Address = require("../models/address");
const { module: config } = require("../config");
const Order = require("../models/order");

exports.addUser = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.status(201).json({
      message: "Congratulations! Your account has been successfully created.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Your account could not be created.",
    });
  }
};

exports.addAddress = async (req, res) => {
  const address = req.body.address;
  const user = req.user;

  const newAddress = new Address(getAddressInfo(address, user));

  try {
    await newAddress.save();

    res.status(200).json({
      message: "You have added a new address.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Unable to add address.",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select({
      _id: 0,
      __v: 0,
      password: 0,
      token: 0,
    });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not access registered users.",
    });
  }
};

exports.getAddressList = async (req, res) => {
  const user = req.user;

  try {
    const addresses = await Address.find({ owner: user._id }).select({
      _id: 0,
      __v: 0,
    });

    res.status(200).json({
      address_list: addressBookMessage(addresses),
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not access address book.",
    });
  }
};

exports.userLogIn = async (req, res) => {
  const user = req.user;

  try {
    const token = jwt.sign({ _id: user._id.toString() }, config.SECRET_PASS);
    user.token = token;
    await user.save();

    res.status(200).json({
      message: "You are now logged in. Your token for this session:",
      token,
    });
  } catch (error) {
    return console.log(error.message);
  }
};

exports.userLogOut = async (req, res) => {
  const user = req.user;

  try {
    user.token = "";
    await user.save();

    return res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Unable to log out.",
    });
  }
};

exports.suspendUser = async (req, res) => {
  const user = req.user;

  try {
    user.isActive = !user.isActive;
    user.token = "";

    await cancelOpenOrder(user);
    await user.save();

    res.status(200).json({
      message: "The user has been " + (user.isActive ? "unsuspended." : "suspended."),
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not suspend user.",
    });
  }
};


function getAddressInfo(address, user) {
  return {
    address,
    owner: user._id,
  };
}

async function cancelOpenOrder(user) {
  const hasOpenOrder = await Order.findOne({ owner: user._id });

  if (hasOpenOrder) {
    hasOpenOrder.state = "cancelled";
    await hasOpenOrder.save();
  }
}

function addressBookMessage(addresses, data) {
  if (addresses.length === 0) {
    return "You do not have addresses saved.";
  } 

  return addresses;
}

