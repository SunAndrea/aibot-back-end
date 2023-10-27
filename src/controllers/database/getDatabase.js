const { createError } = require('../../helpers');
const { Database } = require('../../models/database.model');
const pinoLogger = require('../../../logger');

const getDatabase = async (req, res) => {
  const owner = req.user.id;
  const database = await Database.findOne({ owner });

  res.status(200).json(database);
};

module.exports = getDatabase;
