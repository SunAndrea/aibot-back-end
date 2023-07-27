const express = require("express");
const controllerWrapper = require("../helpers/controllerWrapper");
const auth = require("../controllers/auth/index");
const router = express.Router();
const { validationMiddleware, authorizeMiddleware } = require("../middlewares");
const { registerSchema } = require("../models/users.model");

router.post(
  "/register",
  validationMiddleware(registerSchema),
  controllerWrapper(auth.register)
);
router.post("/login", controllerWrapper(auth.login));

router.get("/logout", authorizeMiddleware, controllerWrapper(auth.logout));
module.exports = router;
