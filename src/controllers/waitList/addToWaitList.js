const { createError } = require('../../helpers');
const { WaitList } = require('../../models/waitList.model');
const sendEmail = require('../../helpers/sendEmail');
const pinoLogger = require('../../../logger');

const { PROJECT_EMAIL } = process.env;

const addToWaitList = async (req, res) => {
  const { name, email, phoneNumber, socialLink } = req.body;

  const user = await WaitList.findOne({ email });
  if (user) {
    const error = createError(409, 'This email address is already used');
    pinoLogger.error(
      { userId: user._id },
      'This email address is already used in waitlist'
    );
    throw error;
  }

  await WaitList.create({
    name,
    email,
    phoneNumber,
    socialLink,
  });

  const mail = {
    to: PROJECT_EMAIL,
    subject: 'Оновлення в WaitList',
    html: `<p>Користувач <strong>${name}</strong> був доданий до WaitList</p><br>
    <p>Email: ${email}</p><br>
    <p>Phone number: ${phoneNumber}</p><br>
    <p>Social link: ${socialLink}</p>
    `,
  };

  try {
    await sendEmail(mail);
    pinoLogger.info(
      { userId: user._id },
      'User was added to waitlist successfully'
    );
    res.status(200).json('Email was sent successfully');
  } catch (error) {
    // pinoLogger.error({ userId: user._id }, error.massege);
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = addToWaitList;
