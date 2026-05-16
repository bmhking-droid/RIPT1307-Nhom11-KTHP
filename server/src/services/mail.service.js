const nodemailer = require("nodemailer");
const mailConfig = require("../configs/mail");

const transporter = nodemailer.createTransport(mailConfig.smtp);

class MailService {
  async sendMail(to, subject, html) {
    try {
      await transporter.sendMail({
        from: mailConfig.defaults.from,
        to,
        subject,
        html,
      });
      console.log(`📧 Email sent to ${to}`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async sendApplicationStatusEmail(email, status, reason = "") {
    let subject = "";
    let html = "";

    if (status === "approved") {
      subject = "✅ Hồ sơ đăng ký của bạn đã được duyệt";
      html = `<h3>Hồ sơ của bạn đã được duyệt thành công!</h3>`;
    } else {
      subject = "❌ Hồ sơ đăng ký của bạn bị từ chối";
      html = `<h3>Hồ sơ bị từ chối.</h3><p>Lý do: ${reason}</p>`;
    }

    await this.sendMail(email, subject, html);
  }
}

module.exports = new MailService();
