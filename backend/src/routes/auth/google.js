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
    console.log(`Peticion get /${strategyName}/callback`);

    let data = {};

    data.name = req.user.displayName;
    data.username = "google" + req.user.id.slice(1, 7);
    data.password = req.user.id;
    data.email = req.user.emails[0].value;
    data.phone = 3001112222;
    
    const user = new User(data);

    try {
      await user.save();
    } catch (error) {
      console.log(error.message);
    }

    const urlFront = process.env.URL_FRONT;

    res.redirect(301, urlFront);
  }
);

module.exports = router;
