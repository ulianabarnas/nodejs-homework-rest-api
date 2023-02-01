const express = require("express");
const { signup, login } = require("../../controllers/authController.js");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { validateBody } = require("../../middlewares/index.js");
const { userSchema } = require("../../schemas/userSchema.js");

const routerAuth = express.Router();

routerAuth.post("/signup", validateBody(userSchema), tryCatchWrapper(signup));
routerAuth.post("/login", validateBody(userSchema), tryCatchWrapper(login));

module.exports = { routerAuth };
