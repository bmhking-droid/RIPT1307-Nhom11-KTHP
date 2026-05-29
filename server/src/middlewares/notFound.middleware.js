const { errorResponse } = require("../utils/response");

const notFound = (req, res, next) => {
  const url = req.originalUrl || "";
  
  // Nếu là file tĩnh trong thư mục /uploads nhưng không tìm thấy trên server
  if (url.startsWith("/uploads/")) {
    if (url.endsWith(".pdf")) {
      return res.redirect("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
    }
    // Trả về ảnh placeholder tuyệt đẹp
    return res.redirect("https://placehold.co/600x800/e2e8f0/475569?text=Minh+Chung+Mau");
  }

  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { notFound };
