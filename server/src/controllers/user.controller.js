const { successResponse, errorResponse } = require("../utils/response");
const { User } = require("../models");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{ model: require("../models").Profile, as: "profile" }],
      });
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new UserController();
