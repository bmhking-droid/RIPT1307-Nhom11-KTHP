const path = require("path");

module.exports = {
  baseDir: path.join(__dirname, "../../uploads"),

  maxFileSize: 5 * 1024 * 1024,
  maxFiles: 10,

  allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],

  documentFolders: {
    CCCD: "cccd",
    HOC_BA: "hoc-ba",
    UU_TIEN: "uu-tien",
    ANH_3X4: "anh-3x4",
    DIEM_THI: "diem-thi",
    AVATAR: "avatar",
    KHAC: "khac",
  },

  generateFileName: (originalName, documentType) => {
    const timestamp = Date.now();
    const ext = path.extname(originalName);
    return `${documentType}-${timestamp}${ext}`;
  },
};
