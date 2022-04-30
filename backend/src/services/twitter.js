const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const strategyName = "twitter";

require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.use(
  strategyName,
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);
