const Joi = require("joi");

// Profile validation schema - supports both EN and VI gender values from frontend
const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).trim(),
  cccd: Joi.string()
    .length(12)
    .pattern(/^[0-9]+$/)
    .allow(null, ""),
  // BUG FIX: Frontend sends 'dob' and 'province', gender may be 'male'/'female' or Vietnamese values
  dob: Joi.date().iso().allow(null, ""),
  gender: Joi.string().valid("Nam", "Nữ", "Khác", "male", "female").allow(null, ""),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .allow(null, ""),
  province: Joi.string().max(100).allow(null, ""),
  address: Joi.string().max(500).allow(null, ""),
  priorityGroup: Joi.string().max(50).allow(null, ""),
  email: Joi.string().allow(null, ""),
  avatarUrl: Joi.string().allow(null, ""),
}).min(1).unknown(true);

module.exports = {
  updateProfileSchema,
};
