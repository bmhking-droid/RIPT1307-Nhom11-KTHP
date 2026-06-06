const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/jwt");
const { errorResponse } = require("../utils/response");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Access token is required", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtConfig.secret);

    // Kiểm tra trạng thái hoạt động thực tế của người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, "Tài khoản không tồn tại hoặc đã bị xóa", 401);
    }
    if (user.isActive === false || user.isActive === 0) {
      return errorResponse(res, "Tài khoản của bạn đã bị khóa bởi quản trị viên", 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Token has expired", 401);
    }
    return errorResponse(res, "Invalid token", 401);
  }
};

module.exports = authenticate;
