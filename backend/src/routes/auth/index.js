const express = require("express");
const router = express.Router();
const google = require("./google");
const facebook = require("./facebook");
const linkedin = require("./linkedin");
const github = require("./github");

router.get("/failed", (req, res) => res.send("Hay un error en el login"));

router.use("", google);
router.use("", facebook);
router.use("", linkedin);
router.use("", github);

module.exports = router;
