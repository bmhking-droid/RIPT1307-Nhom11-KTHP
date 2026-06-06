const { errorResponse } = require("../utils/response");
const https = require("https");
const { URL } = require("url");

// Helper function to download files using native https module, supporting redirects
const downloadFromUrl = (url, maxRedirects = 5) => {
  return new Promise((resolve, reject) => {
    const requestUrl = (targetUrl, redirectCount) => {
      if (redirectCount > maxRedirects) {
        return reject(new Error("Too many redirects"));
      }

      https.get(targetUrl, (response) => {
        // Handle HTTP redirects (301, 302, 307, 308)
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          let nextUrl = response.headers.location;
          if (!nextUrl.startsWith("http")) {
            const parsedUrl = new URL(targetUrl);
            nextUrl = parsedUrl.protocol + "//" + parsedUrl.host + nextUrl;
          }
          return requestUrl(nextUrl, redirectCount + 1);
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`Status ${response.statusCode}`));
        }

        const data = [];
        response.on("data", (chunk) => {
          data.push(chunk);
        });
        response.on("end", () => {
          resolve({
            ok: true,
            status: response.statusCode,
            buffer: async () => Buffer.concat(data)
          });
        });
      }).on("error", (err) => {
        reject(err);
      });
    };

    requestUrl(url, 0);
  });
};

const notFound = async (req, res, next) => {
  const url = req.originalUrl || "";
  
  // Nếu là file tĩnh trong thư mục /uploads nhưng không tìm thấy thực tế trên server
  if (url.startsWith("/uploads/")) {
    try {
      const parts = url.split("/");
      const filename = parts[parts.length - 1].split("?")[0]; // e.g. "0qimb4.png"
      
      let fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569.png?text=Minh+Chung+Mau";
      let contentType = "image/png";
      const lowercaseUrl = url.toLowerCase();
      if (lowercaseUrl.endsWith(".pdf")) {
        contentType = "application/pdf";
      } else if (lowercaseUrl.endsWith(".jpg") || lowercaseUrl.endsWith(".jpeg")) {
        contentType = "image/jpeg";
      }

      // Kiểm tra xem có phải tên file dạng timestamp (local/mock) hay không
      const isLocalFormat = filename.includes("-") && /\d{10,}/.test(filename);
      const isMockFormat = filename.includes("nguyenvana") || filename.includes("lethib") || filename.includes("tranvanc");

      // Nếu không phải file mock/local cũ, tiến hành proxy từ đám mây vĩnh viễn Catbox.moe
      if (!isLocalFormat && !isMockFormat) {
        const catboxUrl = `https://files.catbox.moe/${filename}`;
        console.log(`🔄 [STATIC PROXY] Đang tải file gốc từ đám mây vĩnh viễn để stream về Client: ${catboxUrl}`);
        
        try {
          const response = await downloadFromUrl(catboxUrl);
          if (response.ok) {
            const buffer = await response.buffer();
            
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
        fallbackUrl = "https://placehold.co/400x400/4f46e5/ffffff.png?text=AVATAR";
        contentType = "image/png";
      } else if (url.includes("/cccd/")) {
        fallbackUrl = "https://placehold.co/800x500/e2e8f0/475569.png?text=CCCD+CMND";
        contentType = "image/png";
      } else if (url.includes("/hoc-ba/")) {
        fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569.png?text=Hoc+Ba+THPT";
        contentType = "image/png";
      } else if (url.includes("/uu-tien/")) {
        fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569.png?text=Giay+Uu+Tien";
        contentType = "image/png";
      } else if (url.includes("/diem-thi/")) {
        fallbackUrl = "https://placehold.co/600x800/e2e8f0/475569.png?text=Bang+Diem";
        contentType = "image/png";
      } else if (url.includes("/anh-3x4/")) {
        fallbackUrl = "https://placehold.co/300x400/e2e8f0/475569.png?text=Anh+3x4";
        contentType = "image/png";
      }

      console.log(`🔄 [STATIC FALLBACK] Đang phục vụ ảnh placeholder tương ứng cho: ${url}`);
      
      const response = await downloadFromUrl(fallbackUrl);
      if (response.ok) {
        const buffer = await response.buffer();
        
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
