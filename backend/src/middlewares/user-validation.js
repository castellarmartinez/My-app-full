const Joi = require("joi");
const bcrypt = require("bcrypt");
const { bearerAuth } = require("./auth");
const User = require("../models/user");
const Address = require("../models/address");

const UsuarioSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^[ a-zA-Z]+$/))
    .min(3)
    .max(32)
    .required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net", "edu", "co"],
      },
    })
    .required(),

  username: Joi.string().alphanum().min(3).max(32).required(),

  password: Joi.string().min(6).max(32).required(),

  phone: Joi.number().min(1000000).max(999999999999).required(),
});

// Functions to use in middlewares

function invalidUserError(message) {
  if (message.includes('"name"')) {
    return (
      "You must enter a name with a length between " +
      "3-32 characters only containing letters and spaces."
    );
  } else if (message.includes('"email"')) {
    return "You must enter a valid email.";
  } else if (message.includes('"password"')) {
    return (
      "You must enter a password with a length " + "between 6-32 characters."
    );
  } else if (message.includes('"username"')) {
    return (
      "You must enter an username with a length " +
      " between 3-32 characters only containing letters and numbers."
    );
  } else if (message.includes('"phone"')) {
    return "You must enter a valid phone number.";
  } else {
    return "The fields you are trying to add are not allowed.";
  }
}

// Middlewares

const tryValidUser = async (req, res, next) => {
  try {
    await UsuarioSchema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({
      error: invalidUserError(error.message),
    });
  }
};

const tryRegisteredUser = async (req, res, next) => {
  try {
    const emailTaken = await User.findOne({ email: req.body.email });
    const usernameTaken = await User.findOne({ username: req.body.username });

    if (emailTaken) {
      return res.status(409).json({
        error: "Email already in use.",
      });
    } else if (usernameTaken) {
      return res.status(409).json({
        error: "Username already in use.",
      });
    } else {
      return next();
    }
  } catch (error) {
    return res.status(400).json({
      error: "Unexpected error in user registration.",
    });
  }
};

const tryLogin = async (req, res, next) => {
  try {
    const { email: emailEntered, password: passwordEntered } = req.body;
    const user = await User.findOne({ email: emailEntered });

    if (!user) {
      throw new Error("No user registered with that email.");
    }

    const correctPassword = bcrypt.compareSync(passwordEntered, user.password);

    if (!correctPassword) {
      throw new Error("The password you entered is incorrect.");
    }

    if (!user.isActive) {
      throw new Error("The user is suspended.");
    }

    if (user.token !== "") {
      return res.status(200).json({
        message: "You are trying to log in again.",
        token: user.token,
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const tryLogout = async (req, res, next) => {
  try {
    const user = await bearerAuth(req);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(403).json({
      error: "Please authenticate.",
    });
  }
};

const tryValidAddress = (req, res, next) => {
  if (req.body.address) {
    return next();
  } else {
    return res.status(400).json({
      error: "You must provide an address.",
    });
  }
};

const tryAddressExist = async (req, res, next) => {
  try {
    const exist = await Address.findOne({
      owner: req.user._id,
      option: req.query.option,
    });

    if (!exist) {
      throw new Error("The address you are trying to access does not exist.");
    }

    req.address = exist;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const trySuspend = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        error: "An user with that emain is not registered.",
      });
    } else if (user.isAdmin) {
      return res.status(401).json({
        error: "Admin users cannot be suspended.",
      });
    } else {
      req.user = user;
      return next();
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  tryValidUser,
  tryRegisteredUser,
  tryLogin,
  tryLogout,
  tryValidAddress,
  trySuspend,
  tryAddressExist,
};
