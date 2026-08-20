const Joi = require('joi');

const userSchemaValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(5)
    .max(30)
    .required(),
});

module.exports = {
  userSchemaValidation,
};