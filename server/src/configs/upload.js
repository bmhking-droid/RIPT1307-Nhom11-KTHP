const path = require("path");

module.exports = {
  baseDir: path.join(__dirname, "../../uploads"),

  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,

  allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],

  documentFolders: {
    cccd: "cccd",
    hoc_ba: "hoc-ba",
    giay_ut: "uu-tien",
    anh_3x4: "anh-3x4",
    diem_thi: "diem-thi",
    khac: "khac",
  },

  // Hàm tạo tên file mới
  generateFileName: (originalName, documentType) => {
    const timestamp = Date.now();
    const ext = path.extname(originalName);
    return `${documentType}-${timestamp}${ext}`;
  },
};
