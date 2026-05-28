const bcrypt = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/generateToken");
const { User, Profile } = require("../models");
const { ROLES } = require("../utils/constants");
const logger = require("../utils/logger");

class AuthService {
  async register(data) {
    const { email, password, fullName } = data;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: ROLES.CANDIDATE,
    });

    await Profile.create({
      userId: user.id,
      fullName,
    });

    logger.info(`User registered: ${email}`);

    return user;
  }

  async login(email, password) {
    console.log(`[DEBUG LOGIN] Attempting login for email: "${email}"`);
    const user = await User.findOne({
      where: { email },
      include: [{ model: Profile, as: "profile" }],
    });

    if (!user) {
      console.log(`[DEBUG LOGIN] FAILED: No user found in database with email: "${email}"`);
      throw new Error("Thông tin đăng nhập không chính xác");
    }

    console.log(`[DEBUG LOGIN] User found! ID: ${user.id}, Role: ${user.role}, IsActive: ${user.isActive}, Stored Hash: "${user.password}"`);

    if (user.isActive === false || user.isActive === 0) {
      console.log(`[DEBUG LOGIN] FAILED: User account is locked (isActive = false/0)`);
      throw new Error("Tài khoản của bạn đã bị khóa");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[DEBUG LOGIN] Password check: length=${password ? password.length : 0}. Bcrypt compare result: ${isMatch}`);
    if (!isMatch) {
      console.log(`[DEBUG LOGIN] FAILED: Password mismatch for email: "${email}"`);
      throw new Error("Thông tin đăng nhập không chính xác");
    }

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
        // BUG FIX: Return full profile so frontend can cache in LocalStorage
        profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token) {
    try {
      const decoded = verifyRefreshToken(token);

      const user = await User.findOne({
        where: { id: decoded.id },
        include: [{ model: Profile, as: "profile" }],
      });

      if (!user || !user.isActive) {
        throw new Error("Invalid refresh token");
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: generateToken(payload),
        refreshToken: generateRefreshToken(payload),
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}

module.exports = new AuthService();
