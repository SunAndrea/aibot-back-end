const express = require('express');
const controllerWrapper = require('../helpers/controllerWrapper');
const database = require('../controllers/database/index');
const authorizeMiddleware = require('../middlewares/authorize.middleware');
const { createDatabaseSchema } = require('../models/database.model');

const router = express.Router();
const { validationMiddleware } = require('../middlewares');

router.get('/', authorizeMiddleware, controllerWrapper(database.getDatabase));

router.post(
  '/add',
  validationMiddleware(createDatabaseSchema),
  authorizeMiddleware,
  controllerWrapper(database.createDatabase)
);

module.exports = router;
