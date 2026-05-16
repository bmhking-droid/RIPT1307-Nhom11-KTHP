const { successResponse, errorResponse } = require("../utils/response");
const { Profile } = require("../models");

class ProfileController {
  async updateProfile(req, res) {
    try {
      const [updated] = await Profile.update(req.body, {
        where: { userId: req.user.id },
      });

      if (updated) {
        const profile = await Profile.findOne({
          where: { userId: req.user.id },
        });
        return successResponse(res, profile, "Cập nhật hồ sơ thành công");
      }
      return errorResponse(res, "Không tìm thấy hồ sơ", 404);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new ProfileController();
