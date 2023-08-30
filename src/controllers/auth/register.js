const bcrypt = require("bcryptjs");
const ObjectID = require("bson-objectid");
const sgMail = require("@sendgrid/mail");

const { createError } = require("../../helpers");
const { User } = require("../../models/users.model");

const BASE_URL = process.env.BASE_URL;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const error = createError(409, "email in use");
    throw error;
  }
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const verificationCode = ObjectID();

  const newUser = await User.create({
    email,
    password: hashPassword,
    verificationCode,
  });

  const message = {
    to: email,
    from: "aibottest123@meta.ua",
    subject: "Підтвердження реєстрації",
    text: `Для посилання підтвердження реєстрації перейдіть за посиланням ${BASE_URL}/api/auth/verify/${verificationCode}`,
  };

  try {
    await sgMail.send(message);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("SendGrid error:", error);
    const sendError = createError(500, "Could not send verification email");
    throw sendError;
  }
};

module.exports = register;
