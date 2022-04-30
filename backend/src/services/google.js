const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const strategyName = "google";

require("dotenv").config();

passport.use(
  strategyName,
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
