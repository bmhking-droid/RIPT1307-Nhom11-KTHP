const bcrypt = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { User, Profile } = require("../models");
const { errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

class AuthService {
  async register(data) {
    const { email, password, fullName } = data;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo User
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "student",
    });

    // Tạo Profile
    await Profile.create({
      userId: user.id,
      fullName,
    });

    logger.info(`User registered: ${email}`);

    return user;
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Profile, as: "profile" }],
    });

    if (!user || !user.isActive) {
      throw new Error("Thông tin đăng nhập không chính xác");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Thông tin đăng nhập không chính xác");
    }

    // Tạo payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.profile?.fullName,
      },
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new AuthService();
