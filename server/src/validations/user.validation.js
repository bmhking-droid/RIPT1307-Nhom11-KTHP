const Joi = require("joi");

const updateUserSchema = Joi.object({
  email: Joi.string().email().trim().lowercase(),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  updateUserSchema,
};
