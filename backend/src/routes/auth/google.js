const express = require("express");
const passport = require("passport");
const User = require("../../models/user");

const router = express.Router();
const strategyName = "google";

require("dotenv").config();

router.get(
  `/auth/${strategyName}/`,
  passport.authenticate(strategyName, {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  `/${strategyName}/callback`,
  passport.authenticate(strategyName, {
    session: false,
    failureRedirect: "/failed",
  }),
  async (req, res) => {
    const urlFront = process.env.URL_FRONT;
    const userSchema = createUserSchema(req);
    
    if (await User.findOne({ username: userSchema.username })) {
      return res.redirect(301, urlFront); // If user is resgistered, redirect
    }

    try {
      const user = new User(data);
      await user.save();
    } catch (error) {
      console.log(error.message);
    }

    res.redirect(301, urlFront);
  }
);

function createUserSchema(req) {
  return {
    name: req.user.displayName,
    username: "google" + req.user.id.slice(1, 7),
    password: req.user.id,
    email: req.user.emails[0].value,
    phone: 3001112222,
  }
}

module.exports = router;
