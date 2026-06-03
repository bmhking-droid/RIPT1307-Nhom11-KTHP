const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/generateToken");
const { User, Profile, AuthOtp, sequelize } = require("../models");
const { ROLES } = require("../utils/constants");
const logger = require("../utils/logger");
const mailService = require("./mail.service");

const PASSWORD_RESET_PURPOSE = "PASSWORD_RESET";
const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 15;
const OTP_MAX_ATTEMPTS = 5;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const generateOtp = () => crypto.randomInt(0, 1000000).toString().padStart(6, "0");
const hashResetToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

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
    const normalizedEmail = normalizeEmail(email);
    const responseData = { email: normalizedEmail, expiresInMinutes: OTP_EXPIRY_MINUTES };
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user || user.isActive === false || user.isActive === 0) {
      logger.warn(`Password reset requested for unavailable email: ${normalizedEmail}`);
      return responseData;
    }

    const now = new Date();
    await AuthOtp.update(
      { usedAt: now },
      {
        where: {
          userId: user.id,
          purpose: PASSWORD_RESET_PURPOSE,
          usedAt: null,
        },
      },
    );

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await AuthOtp.create({
      userId: user.id,
      purpose: PASSWORD_RESET_PURPOSE,
      otpHash,
      expiresAt,
    });

    await mailService.sendPasswordResetOtpEmail(user.email, otp, OTP_EXPIRY_MINUTES);
    logger.info(`Password reset OTP generated for user ${user.id}`);

    return responseData;
  }

  async verifyPasswordResetOtp(email, otp) {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user || user.isActive === false || user.isActive === 0) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn");
    }

    const now = new Date();
    const otpRecord = await AuthOtp.findOne({
      where: {
        userId: user.id,
        purpose: PASSWORD_RESET_PURPOSE,
        usedAt: null,
        verifiedAt: null,
        expiresAt: { [Op.gt]: now },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn");
    }

    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      await otpRecord.update({ usedAt: now });
      throw new Error("Mã OTP đã bị khóa do nhập sai quá số lần cho phép");
    }

    const isMatch = await bcrypt.compare(String(otp), otpRecord.otpHash);
    if (!isMatch) {
      const attempts = otpRecord.attempts + 1;
      await otpRecord.update({
        attempts,
        usedAt: attempts >= OTP_MAX_ATTEMPTS ? now : null,
      });
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await otpRecord.update({
      verifiedAt: now,
      resetTokenHash: hashResetToken(resetToken),
      resetTokenExpiresAt: new Date(now.getTime() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000),
    });

    logger.info(`Password reset OTP verified for user ${user.id}`);

    return {
      resetToken,
      expiresInMinutes: RESET_TOKEN_EXPIRY_MINUTES,
    };
  }

  async resetPassword(token, newPassword) {
    const now = new Date();
    const resetTokenHash = hashResetToken(token);
    const otpRecord = await AuthOtp.findOne({
      where: {
        purpose: PASSWORD_RESET_PURPOSE,
        resetTokenHash,
        usedAt: null,
        verifiedAt: { [Op.ne]: null },
        resetTokenExpiresAt: { [Op.gt]: now },
      },
      include: [{ model: User, as: "user" }],
    });

    if (!otpRecord || !otpRecord.user || otpRecord.user.isActive === false || otpRecord.user.isActive === 0) {
      throw new Error("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const transaction = await sequelize.transaction();

    try {
      await otpRecord.user.update({ password: hashedPassword }, { transaction });
      await AuthOtp.update(
        { usedAt: now },
        {
          where: {
            userId: otpRecord.userId,
            purpose: PASSWORD_RESET_PURPOSE,
            usedAt: null,
          },
          transaction,
        },
      );

      await transaction.commit();
      logger.info(`Password reset completed for user ${otpRecord.userId}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new AuthService();
