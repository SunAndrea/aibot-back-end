const passport = require("passport");
const jwt = require("jsonwebtoken");

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User } = require("../../models/users.model");
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const { JWT_SECRET } = process.env;
const BASE_URL = process.env.BASE_URL;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/google/callback`,
      passReqToCallback: true,
      scope: ["email", "profile"],
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log(`profile`, request);

      try {
        const existingUser = await User.findOne({ email: profile.email });
        if (existingUser) {
          const payload = {
            id: existingUser._id,
          };
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
          existingUser.token = token;
          existingUser.save();

          return done(null, existingUser);
        } else {
          console.log(`profile`, profile);
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.email,
          });
          const payload = {
            id: newUser._id,
          };
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
          const loginedUser = await User.findByIdAndUpdate(
            newUser._id,
            { token },
            { new: true }
          ).select("-password");
          return done(null, loginedUser);
        }
      } catch (error) {}
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
