const express = require("express");
const router = express.Router();
const { getSettings, saveSettings } = require("../utils/settings");
const { successResponse, errorResponse } = require("../utils/response");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const data = getSettings();
  return successResponse(res, data, "Lấy cấu hình thành công");
});

router.put("/", authMiddleware, roleMiddleware("ADMIN"), (req, res) => {
  const success = saveSettings(req.body);
  if (success) {
    return successResponse(res, req.body, "Cập nhật cấu hình thành công");
  } else {
    return errorResponse(res, "Không thể lưu cấu hình", 500);
  }
});

module.exports = router;
