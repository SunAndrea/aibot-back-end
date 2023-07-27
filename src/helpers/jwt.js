const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const sign = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10000m" });
};

const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  sign,
  verify,
};
