const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');
const pinoLogger = require('../../../logger');

const logout = async (req, res, next) => {
  const existingUser = await User.findById(req.user.id);
  if (!existingUser) {
    pinoLogger.error(
      'Sorry, can’t find an account associated with this address'
    );
    throw createError(
      401,
      'Sorry, can’t find an account associated with this address'
    );
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { accessToken: null, refreshToken: null },
    { new: true }
  ).select('-password');
  res.status(204).send();
};

module.exports = logout;
