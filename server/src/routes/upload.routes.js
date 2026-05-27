const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  uploadSingle,
  handleUploadError,
} = require("../middlewares/upload.middleware");

// BUG FIX: uploadSingle có thể throw MulterError - cần dùng wrapper để bắt lỗi rồi forward vào error middleware
router.post(
  "/document",
  authMiddleware,
  (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err) return handleUploadError(err, req, res, next);
      next();
    });
  },
  uploadController.uploadDocument,
);

module.exports = router;
