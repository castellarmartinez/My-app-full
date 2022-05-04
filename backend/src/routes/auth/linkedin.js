const express = require("express");
const passport = require("passport");
const User = require("../../models/user");

const router = express.Router();
const strategyName = "linkedin";

require("dotenv").config();

router.get(
  `/auth/${strategyName}/`,
  passport.authenticate(strategyName, {
    session: false,
    scope: ["r_liteprofile", "r_emailaddress"],
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
    username: "linkedin" + req.user.id.slice(1, 7),
    password: req.user.id,
    email: req.user.id.slice(1, 7) + "@delilahresto.com",
    phone: 3001112222,
  };
}

module.exports = router;
