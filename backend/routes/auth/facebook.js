const express = require("express");
const passport = require("passport");

const router = express.Router();
const strategyName = "facebook";

require("dotenv").config();

app.get(`/auth/${strategyName}`, passport.authenticate("facebook"));

app.get(
  `/auth/${strategyName}/callback`,
  passport.authenticate("facebook", { failureRedirect: "/failed" }),
  (req, res) => {
    console.log(`Peticion get /${strategyName}/callback`);
    const data = req.user;
    console.log("Data");
    console.log(data);
    const token = "hgjsd8fs6g7s7df67g6sdf43sdg2s3df5sg6s7df7";
    // Successful authentication, redirect home.
    const urlFront = process.env.URL_FRONT + `/?token=${token}`;

    res.redirect(301, urlFront);
  }
);
