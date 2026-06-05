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
  email: Joi.string().email().trim().lowercase().required(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "Mã OTP phải có độ dài đúng 6 ký tự",
    "any.required": "Mã OTP là bắt buộc",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
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
