const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{7,30}$/)
    .messages({
      "string.pattern.base":
        "Invalid password: password length 7-30 characters; may contain digits or latin letters.",
    })
    .required(),
});

module.exports = {
  userSchema,
};
