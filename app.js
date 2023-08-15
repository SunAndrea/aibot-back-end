require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const cors = require("cors");
require("./src/controllers/auth/googleAuth");

const authRouter = require("./src/routes/auth");
const { errorFilter } = require("./src/middlewares");
const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;
const app = express();
app.use(logger("dev"));
// app.use(cors());
const corsOptions = {
  origin: "http://localhost:2000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    secret: SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/protected", isLoggedIn, (req, res) => {
  console.log("req:", req.user);
  res.send(`Hello ${req.user.name}`);
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorFilter);

module.exports = app;
