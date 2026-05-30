const path = require("path");
const fs = require("fs");
const { successResponse, errorResponse } = require("../utils/response");

// Hàm xây dựng multipart/form-data thủ công không phụ thuộc thư viện bên ngoài (Zero-dependency)
function buildMultipartBody(boundary, fields, fileField) {
  const parts = [];
  
  // Các trường text thông thường
  for (const [key, value] of Object.entries(fields)) {
    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
      `${value}\r\n`
    ));
  }
  
  // Trường file nhị phân
  parts.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\n` +
    `Content-Type: ${fileField.mimetype}\r\n\r\n`
  ));
  parts.push(fileField.buffer);
  parts.push(Buffer.from(`\r\n`));
  
  // Biên kết thúc
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  
  return Buffer.concat(parts);
}

class UploadController {
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return errorResponse(res, "Không có file được upload", 400);
      }

      // 1. Đường dẫn lưu cục bộ (dùng dự phòng hoặc chạy local offline)
      const relativePath = req.file.path
        .replace(/\\/g, "/")
        .split("/uploads/")[1];
      let fileUrl = `/uploads/${relativePath}`;

      // 2. Tự động tải lên đám mây lưu trữ vĩnh viễn Catbox.moe qua HTTPS để vượt qua ổ cứng tạm thời của Render
      try {
        console.log(`☁️ [CATBOX UPLOAD] Đang chuẩn bị đẩy file lên đám mây vĩnh viễn: ${req.file.originalname}`);
        const boundary = "----CatboxBoundary" + Math.random().toString(36).substring(2);
        const fileBuffer = fs.readFileSync(req.file.path);
        
        const body = buildMultipartBody(
          boundary,
          { reqtype: "fileupload" },
          {
            name: "fileToUpload",
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            buffer: fileBuffer
          }
        );
        
        const response = await fetch("https://catbox.moe/user/api.php", {
          method: "POST",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          body: body
        });

        if (response.ok) {
          const catboxUrl = (await response.text()).trim();
          if (catboxUrl && catboxUrl.startsWith("http")) {
            fileUrl = catboxUrl;
            console.log(`✅ [CATBOX SUCCESS] Đã lưu trữ đám mây vĩnh viễn thành công tại: ${fileUrl}`);
          } else {
            console.warn(`⚠️ [CATBOX WARNING] Catbox trả về phản hồi không hợp lệ: "${catboxUrl}"`);
          }
        } else {
          console.warn(`⚠️ [CATBOX FAILED] HTTP status: ${response.status} khi tải lên Catbox`);
        }
      } catch (catboxErr) {
        console.error("💥 [CATBOX ERROR] Không thể tải lên Catbox, chuyển sang dùng lưu trữ cục bộ:", catboxErr.message);
      }

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
