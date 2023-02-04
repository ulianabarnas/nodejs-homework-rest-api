const { HttpError } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

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

  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  await User.findByIdAndUpdate(storedUser._id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: storedUser.subscription,
    },
  });
};

const getCurrentUser = async (req, res, next) => {
  const { email, subscription } = req.user;

  return res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  return res.status(204).json();
};

const changeSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const changedSubscription = await User.findByIdAndUpdate(
    _id,
    {
      subscription,
    },
    { new: true }
  );

  return res.status(200).json(changedSubscription);
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
  changeSubscription,
};
