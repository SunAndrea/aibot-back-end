const { createError } = require('../../helpers');
const { WaitList } = require('../../models/waitList.model');

const addToWaitList = async (req, res) => {
  const { name, email, phoneNumber, socialLink } = req.body;

  const user = await WaitList.findOne({ email });
  if (user) {
    const error = createError(409, 'This email address is already used');
    throw error;
  }

  const newUser = await WaitList.create({
    name,
    email,
    phoneNumber,
    socialLink,
  });

  res.redirect('https://nastyasavchenko.github.io/EVA-I/');
};

module.exports = addToWaitList;
