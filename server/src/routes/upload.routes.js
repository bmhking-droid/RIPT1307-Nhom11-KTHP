const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  uploadSingle,
  handleUploadError,
} = require("../middlewares/upload.middleware");

router.post(
  "/document",
  authMiddleware,
  uploadSingle,
  handleUploadError,
  uploadController.uploadDocument,
);

module.exports = router;
