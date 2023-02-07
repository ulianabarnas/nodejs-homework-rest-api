const express = require("express");
const {
  signup,
  login,
  getCurrentUser,
  logout,
  changeSubscription,
  updateAvatar,
} = require("../../controllers/authController.js");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { validateBody, auth, upload } = require("../../middlewares/index.js");
const {
  joiUserSchema,
  joiSubscriptionSchema,
} = require("../../schemas/userSchema.js");

const routerAuth = express.Router();

routerAuth.post(
  "/signup",
  validateBody(joiUserSchema),
  tryCatchWrapper(signup)
);
routerAuth.post("/login", validateBody(joiUserSchema), tryCatchWrapper(login));
routerAuth.get("/current", auth, tryCatchWrapper(getCurrentUser));
routerAuth.get("/logout", auth, tryCatchWrapper(logout));
routerAuth.patch(
  "/",
  auth,
  validateBody(joiSubscriptionSchema),
  tryCatchWrapper(changeSubscription)
);
routerAuth.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);

module.exports = { routerAuth };
