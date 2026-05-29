const isGmail = (process.env.SMTP_HOST && process.env.SMTP_HOST.includes("gmail")) || 
                (process.env.SMTP_USER && process.env.SMTP_USER.endsWith("@gmail.com"));

const smtpConfig = isGmail 
  ? {
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    }
  : {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true" || parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

module.exports = {
  smtp: smtpConfig,

  defaults: {
    from: `"Hệ Thống Tuyển Sinh" <${process.env.SMTP_USER || "no-reply@example.com"}>`,
  },

  templates: {
    verifyEmail: {
      subject: "Xác thực tài khoản tuyển sinh",
    },
    resetPassword: {
      subject: "Đặt lại mật khẩu tài khoản",
    },
    applicationSubmitted: {
      subject: "Hồ sơ đăng ký của bạn đã được tiếp nhận",
    },
    applicationApproved: {
      subject: "✅ Hồ sơ đăng ký của bạn đã được duyệt",
    },
    applicationRejected: {
      subject: "❌ Thông báo về hồ sơ đăng ký",
    },
  },
};
