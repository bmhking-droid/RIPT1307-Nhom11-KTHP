const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

class MailService {
  /**
   * Khởi tạo động và gửi email qua Google HTTP API Gateway hoặc SMTP
   */
  async sendMail(to, subject, html) {
    // 1. ƯU TIÊN TUYỆT ĐỐI GỬI QUA GOOGLE APPS SCRIPT HTTP API GATEWAY (Vượt qua 100% rào cản chặn SMTP của Render)
    if (process.env.EMAIL_API_URL) {
      try {
        console.log(`🌐 [HTTP EMAIL GATEWAY] Đang gửi email thật qua HTTPS tới: ${to}...`);
        
        // Sử dụng fetch tích hợp sẵn của NodeJS 18+ để gọi Web API qua cổng 443
        const response = await fetch(process.env.EMAIL_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, subject, html }),
        });

        const result = await response.json();
        if (result && result.success) {
          console.log(`📧 [HTTP EMAIL SUCCESS] Email thật đã được gửi thành công đến: ${to} (thông qua Google Gateway)`);
          this.saveEmailToLog(to, subject, html); // Lưu bản sao cục bộ để hiển thị trong Sandbox
          return;
        } else {
          throw new Error(result.error || "Google API Gateway từ chối yêu cầu.");
        }
      } catch (httpError) {
        console.error("💥 [HTTP EMAIL ERROR] Gửi qua Google API Gateway thất bại:", httpError.message);
        console.log("🔄 Đang tự động chuyển sang chế độ gửi dự phòng bằng SMTP truyền thống...");
      }
    }

    // 2. CHẾ ĐỘ DỰ PHÒNG: SMTP TRUYỀN THỐNG (Hoạt động tốt khi test ở local)
    const mailConfig = require("../configs/mail");
    const isSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASSWORD;

    if (!isSmtpConfigured) {
      console.warn("⚠️ [SMTP WARNING] Chưa cấu hình SMTP trên Render Environment. Email được lưu cục bộ.");
      this.saveEmailToLog(to, subject, html);
      return;
    }

    try {
      console.log(`🔌 [SMTP CONNECTING] Đang gửi qua SMTP dự phòng tới: ${to}...`);
      const transporter = nodemailer.createTransport(mailConfig.smtp);

      await transporter.verify();
      await transporter.sendMail({
        from: mailConfig.defaults.from,
        to,
        subject,
        html,
      });

      console.log(`📧 [SMTP SUCCESS] Email đã gửi thành công qua SMTP tới: ${to}`);
      this.saveEmailToLog(to, subject, html);
    } catch (error) {
      console.error("💥 [SMTP ERROR] Gửi email thất bại qua SMTP:", error.message);
      console.log("🔄 [SMTP FALLBACK] Lưu bản xem trước email xuống thư mục logs/emails cục bộ...");
      this.saveEmailToLog(to, subject, html);
    }
  }

  /**
   * Lưu email cục bộ làm bản xem trước cho Sandbox
   */
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
  =========================================
  GỬI ĐẾN: ${to}
  TIÊU ĐỀ: ${subject}
  THỜI GIAN: ${new Date().toLocaleString()}
  =========================================
-->
${html}`;

      fs.writeFileSync(filePath, fileContent, "utf8");
    } catch (err) {
      console.error("💥 [LOG WRITE ERROR] Không thể ghi file log email:", err.message);
    }
  }

  /**
   * Thư thông báo nộp đơn thành công
   */
  async sendApplicationSubmissionEmail(email, applicationDetail) {
    const subject = "📝 Nộp hồ sơ đăng ký xét tuyển thành công - UniAdmission";
    const appCode = String(applicationDetail.id || "").substring(0, 8).toUpperCase();
    
    const html = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
        <div style="text-align: center; border-bottom: 3px solid #10B981; padding-bottom: 25px; margin-bottom: 25px;">
          <h2 style="color: #10B981; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 0.5px; font-family: 'Outfit', sans-serif;">UniAdmission</h2>
          <p style="color: #4B5563; font-size: 14px; margin: 6px 0 0 0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Hệ thống tuyển sinh trực tuyến</p>
        </div>
        <div style="color: #1F2937; line-height: 1.6; font-size: 15px;">
          <h3 style="color: #111827; margin-top: 0; font-size: 18px; font-weight: 700;">Kính chào Thí sinh,</h3>
          <p>Chúc mừng bạn đã nộp hồ sơ nguyện vọng đăng ký xét tuyển trực tuyến thành công trên cổng thông tin <strong>UniAdmission</strong>!</p>
          <p>Thông tin chi tiết về hồ sơ của bạn đã được ghi nhận trên hệ thống:</p>

          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; width: 150px; font-size: 14px;">Mã hồ sơ:</td>
                <td style="padding: 6px 0; font-weight: 800; color: #10B981; font-size: 16px;">#${appCode}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Trường đăng ký:</td>
                <td style="padding: 6px 0; color: #1F2937; font-weight: 600;">${applicationDetail.University?.name || "Học viện Công nghệ Bưu chính Viễn thông"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Ngành đăng ký:</td>
                <td style="padding: 6px 0; color: #1F2937; font-weight: 600;">${applicationDetail.Major?.name || "Công nghệ thông tin"}</td>
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
                <td style="padding: 6px 0; font-weight: 800; color: #111827; font-size: 16px;">${applicationDetail.totalScore || "---"}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 25px 0; text-align: center;">
            <span style="background-color: #FEF3C7; color: #D97706; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #FCD34D;">
              Trạng thái hiện tại: Đang chờ duyệt
            </span>
          </div>

          <p style="margin-top: 25px; color: #4B5563; font-size: 14px; border-left: 3px solid #10B981; padding-left: 12px; font-style: italic;">
            Hội đồng tuyển sinh của nhà trường đang tiến hành thẩm định và đối chiếu các tài liệu minh chứng (học bạ, CCCD) bạn đã tải lên. Kết quả xét duyệt chính thức sẽ được gửi đến email này ngay sau khi hoàn tất.
          </p>
        </div>
        <div style="margin-top: 35px; border-top: 1px solid #edf2f7; padding-top: 20px; text-align: center; color: #9CA3AF; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Đây là thư điện tử gửi tự động từ hệ thống quản lý tuyển sinh trực tuyến UniAdmission.</p>
          <p style="margin: 0;">Vui lòng không phản hồi trực tiếp vào địa chỉ email này.</p>
        </div>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Thư thông báo kết quả duyệt hồ sơ
   */
  async sendApplicationStatusEmail(email, status, reason = "", applicationDetail = {}) {
    const normalizedStatus = String(status || "").toUpperCase();
    const appCode = String(applicationDetail.id || "").substring(0, 8).toUpperCase();
    
    let subject = "";
    let statusText = "";
    let statusColor = "";
    let statusBg = "";
    let statusBorder = "";
    let additionalInfo = "";

    if (normalizedStatus === "APPROVED") {
      subject = "✅ Chúc mừng! Hồ sơ tuyển sinh của bạn đã được PHÊ DUYỆT - UniAdmission";
      statusText = "ĐÃ DUYỆT (THÀNH CÔNG)";
      statusColor = "#10B981";
      statusBg = "#D1FAE5";
      statusBorder = "#A7F3D0";
      additionalInfo = `
        <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
          <p style="color: #065F46; font-weight: bold; margin: 0; font-size: 16px;">🎉 Xin chúc mừng bạn!</p>
          <p style="color: #047857; margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">Hồ sơ nguyện vọng đăng ký xét tuyển trực tuyến của bạn đã vượt qua các vòng kiểm duyệt học vụ thành công.</p>
        </div>
      `;
    } else if (normalizedStatus === "REJECTED") {
      subject = "❌ Thông báo kết quả xét duyệt hồ sơ: TỪ CHỐI - UniAdmission";
      statusText = "TỪ CHỐI (CẦN CẬP NHẬT)";
      statusColor = "#EF4444";
      statusBg = "#FEE2E2";
      statusBorder = "#FCA5A5";
      additionalInfo = `
        <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <p style="color: #991B1B; font-weight: bold; margin: 0 0 8px 0; font-size: 15px;">⚠️ Lý do phản hồi từ Hội đồng tuyển sinh:</p>
          <p style="color: #B91C1C; margin: 0; font-size: 14px; font-weight: 600; line-height: 1.6; padding-left: 10px; border-left: 3px solid #EF4444; font-style: italic;">
            ${reason || "Thông tin tài liệu minh chứng chưa trùng khớp hoặc bị thiếu nét, mờ ảnh."}
          </p>
          <p style="color: #4B5563; margin: 12px 0 0 0; font-size: 13px;">
            * Vui lòng đăng nhập lại vào cổng tuyển sinh của bạn để cập nhật và điều chỉnh lại hồ sơ theo yêu cầu sớm nhất.
          </p>
        </div>
      `;
    } else {
      subject = "🔔 Thông báo cập nhật trạng thái hồ sơ tuyển sinh - UniAdmission";
      statusText = "CHỜ DUYỆT (ĐANG XỬ LÝ)";
      statusColor = "#D97706";
      statusBg = "#FEF3C7";
      statusBorder = "#FCD34D";
      additionalInfo = `
        <div style="background-color: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
          <p style="color: #92400E; font-weight: bold; margin: 0; font-size: 15px;">🔔 Cập nhật thông báo</p>
          <p style="color: #B45309; margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">Hồ sơ nguyện vọng của bạn đã được chuyển về trạng thái đang chờ duyệt thẩm định.</p>
        </div>
      `;
    }

    const html = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #edf2f7; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
        <div style="text-align: center; border-bottom: 3px solid ${statusColor}; padding-bottom: 25px; margin-bottom: 25px;">
          <h2 style="color: ${statusColor}; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 0.5px; font-family: 'Outfit', sans-serif;">UniAdmission</h2>
          <p style="color: #4B5563; font-size: 14px; margin: 6px 0 0 0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Kết quả thẩm định hồ sơ</p>
        </div>
        <div style="color: #1F2937; line-height: 1.6; font-size: 15px;">
          <h3 style="color: #111827; margin-top: 0; font-size: 18px; font-weight: 700;">Kính chào Thí sinh,</h3>
          <p>Hội đồng tuyển sinh trực tuyến <strong>UniAdmission</strong> đã tiến hành kiểm tra thông tin hồ sơ xét tuyển của bạn với kết quả như sau:</p>

          <div style="text-align: center; margin: 25px 0;">
            <span style="background-color: ${statusBg}; color: ${statusColor}; padding: 10px 22px; border-radius: 10px; font-weight: 800; font-size: 15px; border: 1px solid ${statusBorder}; letter-spacing: 0.5px; text-transform: uppercase;">
              Trạng thái: ${statusText}
            </span>
          </div>

          ${additionalInfo}

          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #4B5563; width: 150px; font-size: 14px;">Mã hồ sơ:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #111827; font-size: 14px;">#${appCode}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Trường đăng ký:</td>
                <td style="padding: 5px 0; color: #1F2937; font-weight: 600;">${applicationDetail.University?.name || "Học viện Công nghệ Bưu chính Viễn thông"}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold; color: #4B5563; font-size: 14px;">Ngành đăng ký:</td>
                <td style="padding: 5px 0; color: #1F2937; font-weight: 600;">${applicationDetail.Major?.name || "Công nghệ thông tin"}</td>
              </tr>
            </table>
          </div>

          <p style="margin-top: 25px; color: #4B5563;">
            Bạn có thể đăng nhập vào tài khoản trên cổng tuyển sinh trực tuyến của mình bất cứ lúc nào để xem chi tiết thông báo, cập nhật tài liệu hoặc kiểm tra lịch trình tuyển sinh của nhà trường.
          </p>
        </div>
        <div style="margin-top: 35px; border-top: 1px solid #edf2f7; padding-top: 20px; text-align: center; color: #9CA3AF; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Đây là thư điện tử gửi tự động từ hệ thống quản lý tuyển sinh trực tuyến UniAdmission.</p>
          <p style="margin: 0;">Vui lòng không phản hồi trực tiếp vào địa chỉ email này.</p>
        </div>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }
}

module.exports = new MailService();
