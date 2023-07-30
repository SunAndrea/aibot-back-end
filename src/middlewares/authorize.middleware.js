const { createError } = require("../helpers/index");
const { verify } = require("../helpers/index");
const { User } = require("../models/users.model");

const { JWT_SECRET } = process.env.JWT_SECRET;
const authorizeMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    next(createError(401, "Authorization header is invalid"));
  }

  try {
    const { id } = verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user.token) {
      next(createError(401, "Not authorized"));
    }
    req.user = user;
    // console.log(user);
    next();
  } catch (error) {
    next(createError(401, "Token is invalid"));
  }
};

module.exports = authorizeMiddleware;
