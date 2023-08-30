const { createError } = require("../../helpers");
const { User } = require("../../models/users.model");

const verifyEmail = async (req, res, next) => {
  const { verificationCode } = req.params;
  console.log(`verificationCode`, verificationCode);
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw createError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.status(200).json({ message: "Verification successful" });
};

module.exports = verifyEmail;
