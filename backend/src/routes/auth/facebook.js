const express = require("express");
const passport = require("passport");

const router = express.Router();
const strategyName = "facebook";

require("dotenv").config();

router.get(
  `/auth/${strategyName}`,
  passport.authenticate(strategyName, {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  `/auth/${strategyName}/callback`,
  passport.authenticate(strategyName, {
    session: false,
    failureRedirect: "/failed",
  }),
  (req, res) => {
    console.log(`Peticion get /${strategyName}/callback`);
    const data = req.user;
    console.log("Data");
    console.log(data);
    const token = data.id;
    // Successful authentication, redirect home.
    const urlFront = process.env.URL_FRONT + `/?token=${token}`;

    res.redirect(301, urlFront);
  }
);

module.exports = router;
