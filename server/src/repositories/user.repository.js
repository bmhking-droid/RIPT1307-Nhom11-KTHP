const { User } = require("../models");

class UserRepository {
  async findByEmail(email) {
    return User.findOne({
      where: { email },
      include: [{ model: require("../models").Profile, as: "profile" }],
    });
  }

  async findById(id) {
    return User.findByPk(id, {
      include: [{ model: require("../models").Profile, as: "profile" }],
    });
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updateData) {
    return User.update(updateData, { where: { id } });
  }
}

module.exports = new UserRepository();
