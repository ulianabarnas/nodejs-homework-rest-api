const jwt = require("jsonwebtoken");
const { User } = require("./../models/user");
const { HttpError } = require("../helpers");

const { JWT_SECRET } = process.env;

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

module.exports = auth;
