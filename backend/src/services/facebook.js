const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const strategyName = "facebook";

require("dotenv").config();

passport.use(
  strategyName,
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ["id", "emails", "name"],
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
