const Joi = require("joi");

const updateUserSchema = Joi.object({
  email: Joi.string().email().trim().lowercase(),
  isActive: Joi.boolean(),
}).min(1); // Phải có ít nhất 1 trường được cập nhật

module.exports = {
  updateUserSchema,
};
