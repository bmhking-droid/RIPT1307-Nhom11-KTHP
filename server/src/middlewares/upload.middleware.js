const multer = require("multer");
const path = require("path");
const uploadConfig = require("../configs/upload");
const { errorResponse } = require("../utils/response");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const rawType = req.body.documentType || "KHAC";
    const documentType = String(rawType).trim().toUpperCase();

    const folder = uploadConfig.documentFolders[documentType] || "khac";
    const uploadPath = path.join(uploadConfig.baseDir, folder);

    const fs = require("fs");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const rawType = req.body.documentType || "KHAC";
    const documentType = String(rawType).trim().toUpperCase();
    const fileName = uploadConfig.generateFileName(file.originalname, documentType);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const originalName = file.originalname || "";
  const ext = path.extname(originalName).toLowerCase();
  const basename = path.basename(originalName, ext);

  if (basename.includes(".")) return cb(new Error("Tên file không hợp lệ"), false);
  if (!uploadConfig.allowedMimeTypes.includes(file.mimetype)) return cb(new Error("Chỉ hỗ trợ file JPG, PNG, PDF"), false);
  if (![".jpg", ".jpeg", ".png", ".pdf"].includes(ext)) return cb(new Error("Định dạng file không được hỗ trợ"), false);

  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: uploadConfig.maxFileSize },
  fileFilter: fileFilter,
});

module.exports = {
  uploadSingle: upload.single("file"),
  handleUploadError: (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(res, "File quá lớn. Giới hạn 5MB", 400);
    }
    return errorResponse(res, err.message || "Upload file thất bại", 400);
  }
};
