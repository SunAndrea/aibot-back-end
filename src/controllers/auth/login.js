const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../../models/users.model");
const { createError } = require("../../helpers");
const { JWT_SECRET } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = createError(401, "Invalid credentials");
    throw error;
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    const error = createError(401, "Invalid credentials");
    throw error;
  }

  if (!user.verify) {
    const error = createError(403, "Email not verified");
    throw error;
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  const loginedUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  ).select("-password");
  res.status(200).json(loginedUser);
};

module.exports = login;
