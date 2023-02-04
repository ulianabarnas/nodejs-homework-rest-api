const { HttpError } = require("../helpers");
const { Contact } = require("../models/contact");

const getContacts = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite = [true, false] } = req.query;
  const skip = (page - 1) * limit;

  const contacts = await Contact.find({ owner: _id, favorite })
    .populate("owner", "_id email subscription")
    .skip(skip)
    .limit(limit);

  return res.json(contacts);
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new HttpError(404, "Not found");
  }

  return res.json(contact);
};

const postContact = async (req, res) => {
  const { _id } = req.user;
  const newContact = await Contact.create({ ...req.body, owner: _id });
  return res.status(201).json(newContact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new HttpError(404, "Not found");
  }

  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const { contactId } = req.params;

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw new HttpError(404, "Not found");
  }

  return res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;

  const updatedStatusContact = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    { new: true }
  );

  if (!updatedStatusContact) {
    throw new HttpError(404, "Not found");
  }

  return res.status(200).json(updatedStatusContact);
};

module.exports = {
  getContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  updateStatusContact,
};
