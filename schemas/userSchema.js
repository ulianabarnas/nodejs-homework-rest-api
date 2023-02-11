const Joi = require("joi");

const joiUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{7,30}$/)
    .messages({
      "string.pattern.base":
        "Invalid password: password length 7-30 characters; may contain digits or latin letters.",
    })
    .required(),
});

const joiSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const joiEmailVerifyValidation = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  joiUserSchema,
  joiSubscriptionSchema,
  joiEmailVerifyValidation,
};
