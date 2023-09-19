const bcrypt = require('bcryptjs');
const ObjectID = require('bson-objectid');
const sgMail = require('@sendgrid/mail');

const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');

const { BASE_URL, SENDGRID_API_KEY, SANDGRID_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
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

  const message = {
    to: email,
    from: SANDGRID_EMAIL,
    subject: 'Підтвердження реєстрації',
    text: `Для посилання підтвердження реєстрації перейдіть за посиланням ${BASE_URL}/api/auth/verify/${verificationCode}`,
  };

  try {
    await sgMail.send(message);
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = register;
