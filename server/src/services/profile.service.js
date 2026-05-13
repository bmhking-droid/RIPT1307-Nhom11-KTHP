const { Profile } = require("../models");

class ProfileService {
  async updateProfile(userId, data) {
    return Profile.update(data, { where: { userId } });
  }
}

module.exports = new ProfileService();
