const express = require("express");
const routerContacts = express.Router();

const {
  getContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  updateStatusContact,
} = require("../../controllers/contactsController.js");
const { tryCatchWrapper } = require("../../helpers");
const { validateBody, auth } = require("../../middlewares");
const {
  contactSchema,
  contactStatusSchema,
} = require("../../schemas/contactSchema.js");

routerContacts.get("/", auth, tryCatchWrapper(getContacts));
routerContacts.get("/:contactId", auth, tryCatchWrapper(getContact));
routerContacts.post(
  "/",
  auth,
  validateBody(contactSchema),
  tryCatchWrapper(postContact)
);
routerContacts.delete("/:contactId", auth, tryCatchWrapper(deleteContact));
routerContacts.put(
  "/:contactId",
  auth,
  validateBody(contactSchema),
  tryCatchWrapper(putContact)
);
routerContacts.patch(
  "/:contactId/favorite",
  auth,
  validateBody(contactStatusSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = { routerContacts };
