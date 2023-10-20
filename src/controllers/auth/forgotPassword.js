const ObjectID = require('bson-objectid');
const sgMail = require('@sendgrid/mail');
const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');
const pinoLogger = require('../../../logger');

const { BASE_URL, SENDGRID_API_KEY, SANDGRID_EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      pinoLogger.error(
        'Sorry, can’t find an account associated with this address'
      );
      return res.status(401).json({
        message: 'Sorry, can’t find an account associated with this address',
      });
    }

    const token = ObjectID();
    user.resetPasswordToken = token;
    await user.save();
    const { password, ...userResponse } = user._doc;
    // const resetPasswordLink = `${BASE_URL}/reset-password/${token}`;
    const message = {
      to: email,
      from: SANDGRID_EMAIL,
      subject: 'Скидання пароля',
      text: `Для скидання пароля перейдіть за цим посиланням: https://nastyasavchenko.github.io/EVA-I/reset-password`,
      html: `<p>Для скидання пароля перейдіть за <a href="https://nastyasavchenko.github.io/EVA-I/reset-password">цим посиланням</a></p>`,
    };

    await sgMail.send(message);

    pinoLogger.info({ userId: user._id }, 'Password reset was successful');
    res.status(200).json(userResponse);
  } catch (error) {
    pinoLogger.error(error.message);
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = forgotPassword;
