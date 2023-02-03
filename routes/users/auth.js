const express = require("express");
const {
  signup,
  login,
  currentUser,
  logout,
} = require("../../controllers/authController.js");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { validateBody, auth } = require("../../middlewares/index.js");
const { userSchema } = require("../../schemas/userSchema.js");

const routerAuth = express.Router();

routerAuth.post("/signup", validateBody(userSchema), tryCatchWrapper(signup));
routerAuth.post("/login", validateBody(userSchema), tryCatchWrapper(login));
routerAuth.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));
routerAuth.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

module.exports = { routerAuth };
