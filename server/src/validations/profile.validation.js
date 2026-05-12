const Joi = require("joi");

const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).trim(),
  cccd: Joi.string()
    .length(12)
    .pattern(/^[0-9]+$/)
    .allow(null, ""),
  dateOfBirth: Joi.date().iso().allow(null),
  gender: Joi.string().valid("Nam", "Nữ", "Khác").allow(null),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .allow(null, ""),
  address: Joi.string().max(500).allow(null, ""),
  priorityGroup: Joi.string().max(50).allow(null, ""),
}).min(1); // Phải có ít nhất 1 trường được cập nhật

module.exports = {
  updateProfileSchema,
};
