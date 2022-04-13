const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const strategyName = "facebook";

require("dotenv").config();

passport.use(
  strategyName,
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK,
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
