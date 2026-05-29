module.exports = {
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    // secure là true nếu cổng là 465, ngược lại là false (dùng STARTTLS cho 587)
    secure: process.env.SMTP_SECURE === "true" || parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // Tối quan trọng trên môi trường Cloud: Bỏ qua lỗi chứng chỉ bảo mật để kết nối thông suốt
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000, // Giới hạn chờ kết nối tối đa 15 giây để tránh treo máy chủ
    greetingTimeout: 15000,
    socketTimeout: 20000,
  },

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
