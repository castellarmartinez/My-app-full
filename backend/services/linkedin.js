const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin").Strategy;
const strategyName = "linkedin";

require("dotenv").config();

passport.use(
  strategyName,
  new LinkedInStrategy(
    {
      consumerKey: process.env.LINKEDIN_API_KEY,
      consumerSecret: process.env.LINKEDIN_SECRET_KEY,
      callbackURL: process.env.LINKEDIN_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
