require('dotenv').config();
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
var cors = require('cors');
const passport = require('passport');
const pinoHTTP = require('pino-http');
const cron = require('node-cron');
const authRouter = require('./src/routes/auth');
const waitListRouter = require('./src/routes/waitList');
const databaseRouter = require('./src/routes/database');
const { errorFilter } = require('./src/middlewares');
const pinoLogger = require('./logger');
const { getLogs, sendDailyEmail } = require('./src/controllers/getlogs');

const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;

const app = express();

app.use(pinoHTTP());

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

app.get('/api/logs', getLogs);
app.use('/api/auth', authRouter);
app.use('/api/waitlist', waitListRouter);
app.use('/api/database', databaseRouter);

cron.schedule('00 10 * * *', sendDailyEmail);

app.use((req, res) => {
  pinoLogger.error('Not found');
  res.status(404).json({ message: 'Not found' });
});

app.use(errorFilter);

module.exports = app;
