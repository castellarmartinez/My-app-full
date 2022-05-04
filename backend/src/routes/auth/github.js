const express = require("express");
const passport = require("passport");
const User = require("../../models/user");

const router = express.Router();
const strategyName = "github";

require("dotenv").config();

router.get(
  `/auth/${strategyName}/`,
  passport.authenticate(strategyName, {
    session: false,
    scope: ["user:email", "read:user"],
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
    data.username = req.user.username;
    data.password = req.user.nodeId;
    data.email = req.user.id + "@delilahresto.tk";
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
