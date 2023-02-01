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
const { validateBody } = require("../../middlewares");
const {
  contactSchema,
  contactStatusSchema,
} = require("../../schemas/contactSchema.js");

routerContacts.get("/", tryCatchWrapper(getContacts));
routerContacts.get("/:contactId", tryCatchWrapper(getContact));
routerContacts.post(
  "/",
  validateBody(contactSchema),
  tryCatchWrapper(postContact)
);
routerContacts.delete("/:contactId", tryCatchWrapper(deleteContact));
routerContacts.put(
  "/:contactId",
  validateBody(contactSchema),
  tryCatchWrapper(putContact)
);
routerContacts.patch(
  "/:contactId/favorite",
  validateBody(contactStatusSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = { routerContacts };
