const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

class AuthController {
  async register(req, res) {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return errorResponse(res, error.details[0].message, 400);
      }

      const user = await authService.register(req.body);
      return successResponse(
        res,
        { id: user.id, email: user.email },
        "Đăng ký thành công",
        201,
      );
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async login(req, res) {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return errorResponse(res, error.details[0].message, 400);
      }

      const result = await authService.login(req.body.email, req.body.password);
      return successResponse(res, result, "Đăng nhập thành công");
    } catch (error) {
      console.error(`[ERROR LOGIN] Authentication failed for "${req.body?.email}":`, error.message || error);
      if (error.message === "Tài khoản của bạn đã bị khóa") {
        return errorResponse(res, error.message, 403);
      }

      return errorResponse(res, error.message, 401);
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return errorResponse(res, "Refresh token is required", 400);
      }

      const tokens = await authService.refreshToken(refreshToken);
      return successResponse(res, tokens, "Token refreshed successfully");
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return errorResponse(res, "Email là bắt buộc", 400);
      }

      await authService.forgotPassword(email);
      return successResponse(res, null, "Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn.");
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otpCode, newPassword } = req.body;
      if (!email || !otpCode || !newPassword) {
        return errorResponse(res, "Thông tin email, mã OTP và mật khẩu mới là bắt buộc", 400);
      }

      await authService.resetPassword(email, otpCode, newPassword);
      return successResponse(res, null, "Đặt lại mật khẩu thành công. Vui lòng sử dụng mật khẩu mới để đăng nhập.");
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new AuthController();
