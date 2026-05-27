const nodemailer = require("nodemailer");
const mailConfig = require("../configs/mail");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport(mailConfig.smtp);

class MailService {
  async sendMail(to, subject, html) {

    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;

    if (!isSmtpConfigured) {
      console.log("⚠️ CHƯA CẤU HÌNH SMTP_USER HOẶC SMTP_PASSWORD TRONG server/.env");
      this.saveEmailToLog(to, subject, html);
      return;
    }

    try {
      await transporter.sendMail({
        from: mailConfig.defaults.from,
        to,
        subject,
        html,
      });
      console.log(`📧 Email đã được gửi thành công đến ${to}`);
    } catch (error) {
      console.error("💥 Lỗi gửi email qua SMTP:", error.message);
      console.log("🔄 Tự động chuyển hướng lưu bản xem trước email xuống thư mục cục bộ...");
      this.saveEmailToLog(to, subject, html);
    }
  }

  saveEmailToLog(to, subject, html) {
    try {
      const emailLogsDir = path.join(__dirname, "../../logs/emails");
      if (!fs.existsSync(emailLogsDir)) {
        fs.mkdirSync(emailLogsDir, { recursive: true });
      }

      const cleanTo = String(to || "candidate").replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `email_${Date.now()}_to_${cleanTo}.html`;
      const filePath = path.join(emailLogsDir, fileName);

      const fileContent = `<!--
  GỬI ĐẾN: ${to}
  TIÊU ĐỀ: ${subject}
  THỜI GIAN: ${new Date().toLocaleString()}
-->
${html}`;

      fs.writeFileSync(filePath, fileContent, "utf8");
      console.log(`📂 [BẢN XEM TRƯỚC EMAIL] Đã lưu thành công tại: server/logs/emails/${fileName}`);
    } catch (err) {
      console.error("Không thể ghi log tệp email:", err);
    }
  }

  async sendApplicationSubmissionEmail(email, applicationDetail) {
    const subject = "📝 Nộp hồ sơ đăng ký xét tuyển thành công - UniAdmission";
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e1e8ed; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="text-align: center; border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 25px;">
          <h2 style="color: #10B981; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">UniAdmission</h2>
          <p style="color: #4B5563; font-size: 14px; margin: 5px 0 0 0; font-weight: 500;">Hệ thống tuyển sinh trực tuyến chính thức</p>
        </div>
        <div style="color: #1F2937; line-height: 1.6; font-size: 15px;">
          <h3 style="color: #111827; margin-top: 0; font-size: 18px;">Xin chào thí sinh,</h3>
          <p>Chúc mừng bạn đã nộp hồ sơ đăng ký xét tuyển thành công trên cổng thông tin tuyển sinh <strong>UniAdmission</strong>!</p>
          <p>Thông tin chi tiết về hồ sơ nguyện vọng của bạn:</p>

          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; width: 160px; font-size: 14px;">Mã hồ sơ:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #10B981; font-size: 15px;">#${String(applicationDetail.id || "").substring(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Trường đăng ký:</td>
                <td style="padding: 6px 0; color: #1F2937; font-weight: 500;">${applicationDetail.University?.name || "Học viện Công nghệ Bưu chính Viễn thông"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Ngành đăng ký:</td>
                <td style="padding: 6px 0; color: #1F2937; font-weight: 500;">${applicationDetail.Major?.name || "Công nghệ thông tin"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Đợt tuyển sinh:</td>
                <td style="padding: 6px 0; color: #1F2937; font-size: 14px;">${applicationDetail.AdmissionRound?.name || "Học bạ THPT"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Tổ hợp môn:</td>
                <td style="padding: 6px 0; color: #1F2937; font-weight: bold;">${applicationDetail.AdmissionCombination?.code || "A00"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Điểm xét tuyển:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #1F2937; font-size: 15px;">${applicationDetail.totalScore || "---"}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="background-color: #FEF3C7; color: #D97706; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #FCD34D;">
              Trạng thái hiện tại: Đang chờ duyệt
            </span>
          </div>

          <p style="margin-top: 25px;">Hội đồng tuyển sinh sẽ nhanh chóng tiến hành kiểm tra hồ sơ và minh chứng hợp lệ của bạn. Kết quả xét duyệt sẽ được thông báo ngay lập tức qua email này.</p>
        </div>
        <div style="margin-top: 35px; border-top: 1px solid #e1e8ed; padding-top: 20px; text-align: center; color: #9CA3AF; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Đây là thư điện tử tự động từ hệ thống quản lý tuyển sinh UniAdmission.</p>
          <p style="margin: 0;">Vui lòng không gửi thư phản hồi trực tiếp vào địa chỉ email này.</p>
        </div>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  async sendApplicationStatusEmail(email, status, reason = "", applicationDetail = {}) {
    const normalizedStatus = String(status || "").toUpperCase();
    let subject = "";
    let statusText = "";
    let statusColor = "";
    let statusBg = "";
    let statusBorder = "";
    let additionalInfo = "";

    if (normalizedStatus === "APPROVED") {
      subject = "✅ Hồ sơ đăng ký tuyển sinh của bạn đã được DUYỆT - UniAdmission";
      statusText = "ĐÃ DUYỆT (THÀNH CÔNG)";
      statusColor = "#10B981";
      statusBg = "#D1FAE5";
      statusBorder = "#A7F3D0";
      additionalInfo = `
        <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="color: #065F46; font-weight: bold; margin: 0; font-size: 16px;">🎉 Xin chúc mừng bạn!</p>
          <p style="color: #047857; margin: 5px 0 0 0; font-size: 14px;">Hồ sơ nguyện vọng của bạn đã vượt qua vòng kiểm duyệt học vụ thành công.</p>
        </div>
      `;
    } else if (normalizedStatus === "REJECTED") {
      subject = "❌ Thông tin kết quả xét duyệt hồ sơ: TỪ CHỐI - UniAdmission";
      statusText = "TỪ CHỐI (CẦN SỬA ĐỔI)";
      statusColor = "#EF4444";
      statusBg = "#FEE2E2";
      statusBorder = "#FCA5A5";
      additionalInfo = `
        <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 12px; padding: 15px; margin: 20px 0;">
          <p style="color: #991B1B; font-weight: bold; margin: 0 0 8px 0; font-size: 15px;">⚠️ Lý do từ chối cụ thể của Hội đồng tuyển sinh:</p>
          <p style="color: #B91C1C; margin: 0; font-size: 14px; font-weight: 500; line-height: 1.5; padding-left: 8px; border-left: 3px solid #EF4444;">
            ${reason || "Thông tin minh chứng chưa khớp hoặc tài liệu bị thiếu."}
          </p>
        </div>
      `;
    } else {
      subject = "🔔 Cập nhật trạng thái hồ sơ: CHỜ DUYỆT - UniAdmission";
      statusText = "CHỜ DUYỆT (ĐANG XỬ LÝ)";
      statusColor = "#D97706";
      statusBg = "#FEF3C7";
      statusBorder = "#FCD34D";
      additionalInfo = `
        <div style="background-color: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="color: #92400E; font-weight: bold; margin: 0; font-size: 15px;">🔔 Thông báo trạng thái hồ sơ</p>
          <p style="color: #B45309; margin: 5px 0 0 0; font-size: 14px;">Hồ sơ của bạn đã được hoàn trả về trạng thái đang chờ duyệt trên hệ thống.</p>
        </div>
      `;
    }

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e1e8ed; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="text-align: center; border-bottom: 2px solid ${statusColor}; padding-bottom: 20px; margin-bottom: 25px;">
          <h2 style="color: ${statusColor}; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">UniAdmission</h2>
          <p style="color: #4B5563; font-size: 14px; margin: 5px 0 0 0; font-weight: 500;">Thông tin cập nhật trạng thái hồ sơ xét tuyển</p>
        </div>
        <div style="color: #1F2937; line-height: 1.6; font-size: 15px;">
          <h3 style="color: #111827; margin-top: 0; font-size: 18px;">Xin chào thí sinh,</h3>
          <p>Hội đồng tuyển sinh trực tuyến <strong>UniAdmission</strong> đã tiến hành thẩm định thông tin và cập nhật trạng thái hồ sơ của bạn:</p>

          <div style="text-align: center; margin: 25px 0;">
            <span style="background-color: ${statusBg}; color: ${statusColor}; padding: 8px 20px; border-radius: 10px; font-weight: 700; font-size: 15px; border: 1px solid ${statusBorder}; letter-spacing: 0.5px;">
              TRẠNG THÁI: ${statusText}
            </span>
          </div>

          ${additionalInfo}

          <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #4B5563; width: 160px; font-size: 14px;">Mã hồ sơ:</td>
                <td style="padding: 5px 0; font-weight: bold; color: #111827; font-size: 14px;">#${String(applicationDetail.id || "").substring(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Trường đăng ký:</td>
                <td style="padding: 5px 0; color: #1F2937; font-weight: 500;">${applicationDetail.University?.name || "Học viện Công nghệ Bưu chính Viễn thông"}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Ngành đăng ký:</td>
                <td style="padding: 5px 0; color: #1F2937; font-weight: 500;">${applicationDetail.Major?.name || "Công nghệ thông tin"}</td>
              </tr>
            </table>
          </div>

          <p style="margin-top: 25px;">Bạn có thể đăng nhập vào hệ thống bất cứ lúc nào để kiểm tra chi tiết phản hồi hoặc bổ sung hồ sơ nếu có yêu cầu.</p>
        </div>
        <div style="margin-top: 35px; border-top: 1px solid #e1e8ed; padding-top: 20px; text-align: center; color: #9CA3AF; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Đây là thư điện tử tự động từ hệ thống quản lý tuyển sinh UniAdmission.</p>
          <p style="margin: 0;">Vui lòng không gửi thư phản hồi trực tiếp vào địa chỉ email này.</p>
        </div>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }
}

module.exports = new MailService();
