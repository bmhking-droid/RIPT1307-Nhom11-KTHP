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

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Email không tồn tại trên hệ thống");
    }

    // Sinh mã OTP 6 chữ số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Thời hạn 1 phút (1 * 60 * 1000 ms)
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Gửi email OTP
    const mailService = require("./mail.service");
    await mailService.sendResetPasswordOtpEmail(email, otpCode);

    return true;
  }

  async resetPassword(email, otpCode, newPassword) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Email không tồn tại trên hệ thống");
    }

    if (!user.otpCode || user.otpCode !== String(otpCode).trim()) {
      throw new Error("Mã OTP không chính xác");
    }

    const now = new Date();
    if (user.otpExpiresAt && user.otpExpiresAt < now) {
      throw new Error("Mã OTP đã hết hiệu lực");
    }

    // Hashing mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    return true;
  }
}

module.exports = new AuthService();
