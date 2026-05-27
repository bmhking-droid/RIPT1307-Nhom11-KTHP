const { successResponse, errorResponse } = require("../utils/response");
const { User, Profile } = require("../models");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Profile, as: "profile" }],
      });
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        where: { role: 'CANDIDATE' },
        attributes: ['id', 'email', 'role', 'isActive', 'createdAt'],
        include: [{ model: Profile, as: "profile", attributes: ['fullName', 'phone'] }],
        order: [['createdAt', 'DESC']],
      });
      return successResponse(res, users, "Lấy danh sách người dùng thành công");
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return errorResponse(res, "Không tìm thấy người dùng", 404);

      user.isActive = !user.isActive;
      await user.save();

      return successResponse(res, user, `Đã ${user.isActive ? 'mở khóa' : 'khóa'} tài khoản`);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new UserController();
