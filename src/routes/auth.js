const express = require("express");
const controllerWrapper = require("../helpers/controllerWrapper");
const auth = require("../controllers/auth/index");
const router = express.Router();
const { validationMiddleware, authorizeMiddleware } = require("../middlewares");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../models/users.model");

router.post(
  "/register",
  validationMiddleware(registerSchema),
  controllerWrapper(auth.register)
);
router.post(
  "/login",
  validationMiddleware(loginSchema),
  controllerWrapper(auth.login)
);

router.get("/logout", authorizeMiddleware, controllerWrapper(auth.logout));

router.get("/verify/:verificationCode", controllerWrapper(auth.verifyEmail));

router.post(
  "/forgot-password",
  validationMiddleware(forgotPasswordSchema),
  controllerWrapper(auth.forgotPassword)
);

router.post(
  "/reset-password/:token",
  validationMiddleware(resetPasswordSchema),
  controllerWrapper(auth.resetPassword)
);


module.exports = router;
