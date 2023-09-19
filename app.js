require('dotenv').config();
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
var cors = require('cors');
const passport = require('passport');
const authRouter = require('./src/routes/auth');
const { errorFilter } = require('./src/middlewares');
const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;
const app = express();
app.use(logger('dev'));
app.use(cors());
// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://localhost:5173',
//   })
// );

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

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

// app.get('/protected', isLoggedIn, (req, res) => {
//   console.log('req:', req.user);
//   res.send(`Hello ${req.user.name}`);
// });

// app.get('/failure', (req, res) => {
//   res.send('Failed to authenticate..');
// });

app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorFilter);

module.exports = app;
