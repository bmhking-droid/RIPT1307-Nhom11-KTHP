const fs = require("fs");
const path = require("path");

const settingsFilePath = path.join(__dirname, "../configs/systemSettings.json");

const getSettings = () => {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return {
        autoSendEmail: true,
        allowCandidateSubmit: true,
        systemName: "Hệ thống tuyển sinh trực tuyến",
        emailSenderName: "Phòng tuyển sinh",
        emailFooter: "Trân trọng, Phòng tuyển sinh"
      };
    }
    const data = fs.readFileSync(settingsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {
      autoSendEmail: true,
      allowCandidateSubmit: true,
      systemName: "Hệ thống tuyển sinh trực tuyến",
      emailSenderName: "Phòng tuyển sinh",
      emailFooter: "Trân trọng, Phòng tuyển sinh"
    };
  }
};

const saveSettings = (settings) => {
  try {
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Lỗi lưu cấu hình:", error);
    return false;
  }
};

module.exports = {
  getSettings,
  saveSettings,
};
