const { HttpError, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { v4 } = require("uuid");

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const avatarURL = gravatar.url(email, { protocol: "https", d: "robohash" });

    const verificationToken = v4();

    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    await sendEmail({
      to: email,
      subject: "Please, confirm your email",
      html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Confirm your email</a>`,
    });

    return res.status(201).json({
      user: {
        email,
        subscription: savedUser.subscription,
        avatarURL,
        verificationToken,
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

  if (!storedUser.verify) {
    throw new HttpError(
      401,
      "Email is not verified! Please check your mailbox"
    );
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

const updateAvatar = async (req, res, next) => {
  const { path: tmpPath, originalname } = req.file;
  const { _id: id } = req.user;
  const avatarName = `${id}_${originalname}`;
  const avatarsDir = path.join(__dirname, "../public/avatars");
  try {
    const publicPath = path.join(avatarsDir, avatarName);
    await fs.rename(tmpPath, publicPath);
    const avatarURL = path.join("public", "avatars", avatarName);
    await User.findByIdAndUpdate(id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({
    verificationToken,
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.json({ message: "Verification successful" });
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
  changeSubscription,
  updateAvatar,
  verifyEmail,
};
