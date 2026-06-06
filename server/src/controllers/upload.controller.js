const path = require("path");
const fs = require("fs");
const https = require("https");
const { successResponse, errorResponse } = require("../utils/response");

// Hàm thực hiện POST HTTPS nhị phân lên Catbox.moe không phụ thuộc fetch
function uploadToCatbox(boundary, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "catbox.moe",
      port: 443,
      path: "/user/api.php",
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Length": body.length
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: async () => data
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(body);
    req.end();
  });
}

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

      // 1. Đường dẫn lưu cục bộ mặc định ban đầu
      const relativePath = req.file.path
        .replace(/\\/g, "/")
        .split("/uploads/")[1];
      const folderName = relativePath.split("/")[0]; // e.g. "cccd", "hoc-ba", "avatar"
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
            filename: req.file.filename || req.file.originalname, // Sử dụng tên file an toàn đã qua Multer để tránh lỗi mã hóa ký tự đặc biệt
            mimetype: req.file.mimetype,
            buffer: fileBuffer
          }
        );
        
        const response = await uploadToCatbox(boundary, body);

        if (response.ok) {
          const catboxUrl = (await response.text()).trim();
          if (catboxUrl && catboxUrl.startsWith("http")) {
            console.log(`✅ [CATBOX SUCCESS] Đã tải lên thành công: ${catboxUrl}`);
            
            // Trích xuất tên file duy nhất từ Catbox (ví dụ: "0qimb4.png")
            const catboxFilename = catboxUrl.split("/").pop();
            
            // Đường dẫn lưu mới cục bộ khớp với Catbox ID
            const newLocalPath = path.join(path.dirname(req.file.path), catboxFilename);
            
            // Đổi tên file cục bộ trên đĩa để đồng bộ hoàn toàn
            fs.renameSync(req.file.path, newLocalPath);
            
            // Gán lại fileUrl thành dạng đường dẫn tương đối đi qua Proxy bảo mật của backend
            fileUrl = `/uploads/${folderName}/${catboxFilename}`;
            console.log(`🔄 [SYNC SUCCESS] Đã đổi tên file cục bộ thành: ${catboxFilename}. URL lưu database: ${fileUrl}`);
          } else {
            console.warn(`⚠️ [CATBOX WARNING] Phản hồi Catbox không hợp lệ: "${catboxUrl}"`);
          }
        } else {
          console.warn(`⚠️ [CATBOX FAILED] HTTP status: ${response.status} khi tải lên Catbox`);
        }
      } catch (catboxErr) {
        console.error("💥 [CATBOX ERROR] Không thể tải lên Catbox, dùng lưu trữ cục bộ dự phòng:", catboxErr.message);
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
