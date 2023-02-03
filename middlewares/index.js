const jwt = require("jsonwebtoken");
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

  if (type !== "Bearer" || !token) {
    throw new HttpError(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw new HttpError(401, "Not authorized");
    }
    throw error;
  }

  next();
};

module.exports = {
  validateBody,
  auth,
};
