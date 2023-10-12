const logger = require('../../../logger');

const getCurrent = async (req, res) => {
  logger.info('Get current user');
  res.status(200).json(req.user);
};

module.exports = getCurrent;
