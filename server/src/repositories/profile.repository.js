const { Profile } = require("../models");

class ProfileRepository {
  async findByUserId(userId) {
    return Profile.findOne({ where: { userId } });
  }

  async update(userId, profileData) {
    return Profile.update(profileData, {
      where: { userId },
      returning: true,
    });
  }

  async create(profileData) {
    return Profile.create(profileData);
  }
}

module.exports = new ProfileRepository();
