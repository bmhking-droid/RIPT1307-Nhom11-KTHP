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
      return errorResponse(res, error.message, 401);
    }
  }
}

module.exports = new AuthController();
