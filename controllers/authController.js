const { HttpError } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      user: {
        email,
        subscription: savedUser.subscription,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new HttpError(409, "Email in use");
    }

    throw error;
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);

  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  // console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  res.json({
    token: "<TOKEN>",
    user: {
      email,
      subscription: storedUser.subscription,
    },
  });
};

module.exports = {
  signup,
  login,
};
