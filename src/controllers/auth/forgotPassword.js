const ObjectID = require("bson-objectid");
const sgMail = require("@sendgrid/mail");
const { createError } = require("../../helpers");
const { User } = require("../../models/users.model");
const { BASE_URL, SENDGRID_API_KEY, SANDGRID_EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = ObjectID();
    user.resetPasswordToken = token;
    await user.save();
    const { password, ...userResponse } = user._doc;
    const resetPasswordLink = `${BASE_URL}/reset-password/${token}`;
    const message = {
      to: email,
      from: SANDGRID_EMAIL,
      subject: "Скидання пароля",
      text: `Для скидання пароля перейдіть за цим посиланням: ${resetPasswordLink}`,
      html: `<p>Для скидання пароля перейдіть за <a href="${resetPasswordLink}">цим посиланням</a></p>`,
    };

    await sgMail.send(message);

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "An error occurred when sending the email to reset the password.",
      });
  }
};

module.exports = forgotPassword;
