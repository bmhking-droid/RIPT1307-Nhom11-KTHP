const { successResponse, errorResponse } = require("../utils/response");
const { Profile, User } = require("../models");

class ProfileController {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'email', 'role'],
        include: [{ model: Profile, as: "profile" }]
      });

      if (!user) {
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      return successResponse(res, user, "Lấy thông tin cá nhân thành công");
    } catch (error) {
      console.error("💥 [PROFILE GET ERROR]:", error.message);
      return errorResponse(res, error.message, 500);
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, phone, gender, dob, province, address, avatarUrl, score, priorityGroup } = req.body;

      let dbGender = undefined;
      if (gender === 'male' || gender === 'Nam') dbGender = 'Nam';
      if (gender === 'female' || gender === 'Nữ') dbGender = 'Nữ';

      let combinedAddress = address || "";
      if (province && !combinedAddress.includes(province)) {
        combinedAddress = combinedAddress ? `${combinedAddress}, ${province}` : province;
      }

      const profileData = {
        fullName,
        phone,
        gender: dbGender,
        dateOfBirth: dob || null,
        address: combinedAddress,
        score: score !== undefined && score !== '' ? score : null,
        priorityGroup: priorityGroup !== undefined && priorityGroup !== '' ? priorityGroup : null,
      };

      if (avatarUrl !== undefined) {
        profileData.avatarUrl = avatarUrl;
      }

      const [profile, created] = await Profile.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          ...profileData
        }
      });

      if (!created) {
        await profile.update(profileData);
      }

      const updatedUser = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'email', 'role'],
        include: [{ model: Profile, as: "profile" }]
      });

      return successResponse(res, updatedUser, "Cập nhật hồ sơ cá nhân thành công");
    } catch (error) {
      console.error("💥 [PROFILE ERROR]:", error.message);
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new ProfileController();
