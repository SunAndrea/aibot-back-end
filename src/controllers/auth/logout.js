const { createError } = require("../../helpers");
const { User } = require("../../models/users.model");

const logout = async (req, res, next) => {
  const existingUser = await User.findById(req.user.id);
  if (!existingUser) {
    throw createError(404, "User not found");
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { token: null },
    { new: true }
  ).select("-password");
  res.status(204).send();
};

module.exports = logout;
