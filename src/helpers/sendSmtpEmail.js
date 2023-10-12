const nodemailer = require('nodemailer');
// const { MAIL_PASSWORD, EMAIL } = process.env;

const nodemailConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: 'eva-i-bot@ukr.net',
    pass: 'JDW4n2HOlAFz0fl2',
  },
};

const transporter = nodemailer.createTransport(nodemailConfig);
const sendSmtpEmail = async (data) => {
  const email = { ...data, from: 'eva-i-bot@ukr.net' };
  await transporter.sendMail(email);
};

module.exports = { sendSmtpEmail };
