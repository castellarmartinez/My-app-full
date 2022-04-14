const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const strategyName = "linkedin";

require("dotenv").config();

passport.use(
  strategyName,
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
