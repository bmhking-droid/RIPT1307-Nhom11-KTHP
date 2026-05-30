const { errorResponse } = require("../utils/response");

const notFound = async (req, res, next) => {
  const url = req.originalUrl || "";
  
  // Nếu là file tĩnh trong thư mục /uploads nhưng không tìm thấy thực tế trên server
  if (url.startsWith("/uploads/")) {
    try {
      const parts = url.split("/");
      const filename = parts[parts.length - 1].split("?")[0]; // e.g. "0qimb4.png"
      
      let fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569?text=Minh+Chung+Mau";
      let contentType = url.endsWith(".pdf") ? "application/pdf" : "image/png";

      // Kiểm tra xem có phải tên file dạng timestamp (local/mock) hay không
      const isLocalFormat = filename.includes("-") && /\d{10,}/.test(filename);
      const isMockFormat = filename.includes("nguyenvana") || filename.includes("lethib") || filename.includes("tranvanc");

      // Nếu không phải file mock/local cũ, tiến hành proxy từ đám mây vĩnh viễn Catbox.moe
      if (!isLocalFormat && !isMockFormat) {
        const catboxUrl = `https://files.catbox.moe/${filename}`;
        console.log(`🔄 [STATIC PROXY] Đang tải file gốc từ đám mây vĩnh viễn để stream về Client: ${catboxUrl}`);
        
        try {
          const response = await fetch(catboxUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            res.setHeader("Content-Type", contentType);
            res.setHeader("Cache-Control", "public, max-age=86400"); // Cache 1 ngày để tối ưu hiệu năng
            return res.send(buffer);
          } else {
            console.warn(`⚠️ [STATIC PROXY FAILED] Catbox trả về status ${response.status} cho file: ${filename}`);
          }
        } catch (fetchErr) {
          console.error(`💥 [STATIC PROXY ERROR] Không thể tải file từ Catbox:`, fetchErr.message);
        }
      }

      // Fallback sang placeholder thông minh nếu không tìm thấy trên Catbox hoặc là tệp cục bộ cũ/giả lập
      if (url.endsWith(".pdf")) {
        fallbackUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
        contentType = "application/pdf";
      } else if (url.includes("/avatar/")) {
        fallbackUrl = "https://placehold.co/400x400/4f46e5/ffffff?text=AVATAR";
        contentType = "image/png";
      } else if (url.includes("/cccd/")) {
        fallbackUrl = "https://placehold.co/800x500/e2e8f0/475569?text=CCCD+CMND";
        contentType = "image/png";
      } else if (url.includes("/hoc-ba/")) {
        fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569?text=Hoc+Ba+THPT";
        contentType = "image/png";
      } else if (url.includes("/uu-tien/")) {
        fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569?text=Giay+Uu+Tien";
        contentType = "image/png";
      } else if (url.includes("/diem-thi/")) {
        fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569?text=Bang+Diem";
        contentType = "image/png";
      } else if (url.includes("/anh-3x4/")) {
        fallbackUrl = "https://placehold.co/300x400/e2e8f0/475569?text=Anh+3x4";
        contentType = "image/png";
      }

      console.log(`🔄 [STATIC FALLBACK] Đang phục vụ ảnh placeholder tương ứng cho: ${url}`);
      
      const response = await fetch(fallbackUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buffer);
      }
    } catch (err) {
      console.error("💥 [STATIC FALLBACK PROXY ERROR]:", err.message);
    }
  }

  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { notFound };
