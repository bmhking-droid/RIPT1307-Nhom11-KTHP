const { User } = require("../models");

class UserService {
  async getUserById(id) {
    return User.findByPk(id, {
      include: ["profile"],
    });
  }
}

module.exports = new UserService();
