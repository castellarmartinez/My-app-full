const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { module: config } = require("../config");

// Funciones usadas para la creación de los middlewares

async function bearerAuth(req) {
  if (req.header("Authorization")) {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.SECRET_PASS);

    return await User.findOne({ _id: decoded._id, token: token });
  }
}

// Middlewares

const adminAuthentication = async (req, res, next) => {
  try {
    const user = await bearerAuth(req);

    if (!user) {
      throw new Error("Please authenticate.");
    } else if (!user.isAdmin) {
      throw new Error("You need admin privileges for this operation.");
    } else {
      return next();
    }
  } catch (error) {
    return res.status(403).json({
      error: error.message,
    });
  }
};

const customerAuthentication = async (req, res, next) => {
  try {
    const user = await bearerAuth(req);

    if (!user) {
      throw new Error("Please authenticate.");
    } else if (user.isAdmin) {
      throw new Error("Administrators cannot perform this operation.");
    } else if (!user.isActive) {
      throw new Error("The user is suspended.");
    } else {
      req.user = user;
      return next();
    }
  } catch (error) {
    return res.status(403).json({
      error: error.message,
    });
  }
};

const userAuthentication = async (req, res, next) => {
  try {
    const user = await bearerAuth(req);

    if (!user) {
      throw new Error("Please authenticate.");
    } else if (!user.isActive) {
      throw new Error("The user is suspended.");
    } else {
      return next();
    }
  } catch (error) {
    return res.status(403).json({
      error: error.message,
    });
  }
};

module.exports = {
  adminAuthentication,
  customerAuthentication,
  userAuthentication,
  bearerAuth,
};
