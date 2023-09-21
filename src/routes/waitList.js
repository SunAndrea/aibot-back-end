const express = require('express');
const controllerWrapper = require('../helpers/controllerWrapper');
const waitList = require('../controllers/waitList/index');
const router = express.Router();
const { validationMiddleware } = require('../middlewares');
const { addToWaitListSchema } = require('../models/waitList.model');

router.get('/', controllerWrapper(waitList.getWaitList));

router.post(
  '/add',
  validationMiddleware(addToWaitListSchema),
  controllerWrapper(waitList.addToWaitList)
);

module.exports = router;
