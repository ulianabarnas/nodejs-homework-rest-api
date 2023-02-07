const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { User } = require("./../models/user");
const { HttpError } = require("../helpers");

const { JWT_SECRET } = process.env;

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      throw new HttpError(400, error.message);
    }

    return next();
  };
};

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  try {
    if (type !== "Bearer") {
      throw new HttpError(401, "Not authorized");
    }
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw new HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      next(new HttpError(401, "Not authorized"));
    }
    next(error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2048,
  },
});

const upload = multer({
  storage,
});

module.exports = {
  validateBody,
  auth,
  upload,
};
