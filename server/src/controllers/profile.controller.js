const { successResponse, errorResponse } = require("../utils/response");
const { Profile, User } = require("../models");

class ProfileController {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      console.log(`🔍 [DEBUG GET PROFILE] Requesting profile for userId: "${userId}"`);

      const user = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'email', 'role'],
        include: [{ model: Profile, as: "profile" }]
      });

      if (!user) {
        console.log(`⚠️ [DEBUG GET PROFILE] User not found for id: "${userId}"`);
        return errorResponse(res, "Không tìm thấy người dùng", 404);
      }

      console.log(`✅ [DEBUG GET PROFILE] Successfully loaded: ${JSON.stringify(user.profile || {})}`);
      return successResponse(res, user, "Lấy thông tin cá nhân thành công");
    } catch (error) {
      console.error("💥 [PROFILE GET ERROR]:", error.message);
      return errorResponse(res, error.message, 500);
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      console.log(`📥 [DEBUG UPDATE PROFILE] Received body from userId "${userId}":`, JSON.stringify(req.body));
      
      const { fullName, phone, gender, dob, province, address, avatarUrl, score, priorityGroup, cccd } = req.body;

      let dbGender = undefined;
      if (gender === 'male' || gender === 'Nam') dbGender = 'Nam';
      if (gender === 'female' || gender === 'Nữ') dbGender = 'Nữ';

      const profileData = {
        fullName,
        phone,
        gender: dbGender,
        dateOfBirth: dob || null,
        province: province || null,
        address: address || null,
        cccd: cccd !== undefined && cccd !== '' ? cccd : null,
        score: score !== undefined && score !== '' ? score : null,
        priorityGroup: priorityGroup !== undefined && priorityGroup !== '' ? priorityGroup : null,
      };

      if (avatarUrl !== undefined) {
        profileData.avatarUrl = avatarUrl;
      }

      // Loại bỏ các trường undefined để tránh lỗi ghi đè dữ liệu
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) {
          delete profileData[key];
        }
      });

      console.log(`⚙️ [DEBUG UPDATE PROFILE] Sanitized profileData to save:`, JSON.stringify(profileData));

      // Tìm email của user làm fallback tên nếu chưa có
      let fallbackName = "Thí sinh";
      const user = await User.findByPk(userId);
      if (user && user.email) {
        fallbackName = user.email.split('@')[0];
      }

      const [profile, created] = await Profile.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          fullName: fullName || fallbackName,
          ...profileData
        }
      });

      if (!created) {
        console.log(`💾 [DEBUG UPDATE PROFILE] Profile already exists, performing update...`);
        await profile.update(profileData);
      } else {
        console.log(`🆕 [DEBUG UPDATE PROFILE] New profile created successfully!`);
      }

      const updatedUser = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'email', 'role'],
        include: [{ model: Profile, as: "profile" }]
      });

      console.log(`🎉 [DEBUG UPDATE PROFILE] Successfully saved & returning:`, JSON.stringify(updatedUser.profile || {}));
      return successResponse(res, updatedUser, "Cập nhật hồ sơ cá nhân thành công");
    } catch (error) {
      console.error("💥 [PROFILE UPDATE ERROR]:", error.message);
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new ProfileController();
