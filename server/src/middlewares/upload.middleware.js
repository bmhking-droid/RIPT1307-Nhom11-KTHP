const multer = require("multer");
const path = require("path");
const uploadConfig = require("../configs/upload");
const { errorResponse } = require("../utils/response");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const documentType = req.body.documentType || "khac";
    const folder = uploadConfig.documentFolders[documentType] || "khac";
    const uploadPath = path.join(uploadConfig.baseDir, folder);

    // Tạo thư mục nếu chưa tồn tại
    const fs = require("fs");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const documentType = req.body.documentType || "khac";
    const fileName = uploadConfig.generateFileName(
      file.originalname,
      documentType,
    );
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ file JPG, PNG, PDF"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: uploadConfig.maxFileSize },
  fileFilter: fileFilter,
});

const uploadSingle = upload.single("file");

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(res, "File quá lớn. Giới hạn 5MB", 400);
    }
  }
  return errorResponse(res, err.message || "Upload file thất bại", 400);
};

module.exports = {
  uploadSingle,
  handleUploadError,
};
