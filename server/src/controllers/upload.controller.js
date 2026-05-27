const path = require("path");
const { successResponse, errorResponse } = require("../utils/response");

class UploadController {
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return errorResponse(res, "Không có file được upload", 400);
      }

      const relativePath = req.file.path
        .replace(/\\/g, "/")
        .split("/uploads/")[1];
      const fileUrl = `/uploads/${relativePath}`;

      const fileData = {
        documentType: req.body.documentType,
        fileUrl,
        originalName: req.file.originalname,
        fileSize: req.file.size,
      };

      return successResponse(res, fileData, "Upload file thành công");
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new UploadController();
