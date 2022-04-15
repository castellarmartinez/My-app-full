const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const strategyName = "github";

require("dotenv").config();

passport.use(
  strategyName,
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
