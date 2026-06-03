const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  fullName: Joi.string().min(2).max(100).trim().required().messages({
    "any.required": "Họ tên là bắt buộc",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  otp: Joi.string().pattern(/^\d{6}$/).required().messages({
    "string.pattern.base": "Mã OTP phải gồm 6 chữ số",
    "any.required": "Mã OTP là bắt buộc",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().min(32).required().messages({
    "string.min": "Token đặt lại mật khẩu không hợp lệ",
    "any.required": "Token đặt lại mật khẩu là bắt buộc",
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
};
