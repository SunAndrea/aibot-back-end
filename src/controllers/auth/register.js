const bcrypt = require('bcryptjs');
const ObjectID = require('bson-objectid');
const sendEmail = require('../../helpers/sendEmail');
const pinoLogger = require('../../../logger');

const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');

const { BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    pinoLogger.error(`${email} is already used`);
    const error = createError(409, 'This email address is already used');
    throw error;
  }
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const verificationCode = ObjectID();

  const newUser = await User.create({
    email,
    password: hashPassword,
    verificationCode,
  });

  const { password: userPassword, ...userResponse } = newUser._doc;

  const mail = {
    to: email,
    subject: 'Підтвердження реєстрації',
    html: `<p>Для завершення реєстрації перейдіть за 
    <a href='${BASE_URL}/api/auth/verify/${verificationCode}'>посиланням</a>
    </p>`,
  };

  try {
    await sendEmail(mail);
    res.status(200).json('Email was sent successfully');
    pinoLogger.info(
      `An email to complete registration was successfully sent to ${email}`
    );
  } catch (error) {
    res.status(error.status).json({ message: error.message });
    pinoLogger.error(error.message);
  }
};

module.exports = register;
