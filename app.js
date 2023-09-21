require('dotenv').config();
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
var cors = require('cors');
const passport = require('passport');
const authRouter = require('./src/routes/auth');
const waitListRouter = require('./src/routes/waitList');
const { errorFilter } = require('./src/middlewares');
const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;
const app = express();
app.use(logger('dev'));
app.use(cors());

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

app.use('/api/auth', authRouter);
app.use('/api/waitList', waitListRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorFilter);

module.exports = app;
