const bcrypt = require("bcryptjs");
const { User } = require("../../models/users.model");
const { createError } = require("../../helpers");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const error = createError(409, "email in use");
    throw error;
  }
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  //   const { password, ...userWithoutPassword } = newUser;

  res.status(201).json(newUser);
};

module.exports = register;
