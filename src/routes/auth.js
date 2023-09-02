const express = require("express");
const controllerWrapper = require("../helpers/controllerWrapper");
const auth = require("../controllers/auth/index");
const router = express.Router();
const { validationMiddleware, authorizeMiddleware } = require("../middlewares");
const { registerSchema, loginSchema } = require("../models/users.model");

router.post(
  "/register",
  validationMiddleware(registerSchema),
  controllerWrapper(auth.register)
);
router.post("/login", controllerWrapper(auth.login));

router.get(
  "/logout",
  validationMiddleware(loginSchema),
  authorizeMiddleware,
  controllerWrapper(auth.logout)
);

router.get("/verify/:verificationCode", controllerWrapper(auth.verifyEmail));

router.post("/forgot-password", controllerWrapper(auth.forgotPassword));

router.post("/reset-password/:token", controllerWrapper(auth.ressetPassword));

module.exports = router;
