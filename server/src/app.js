const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes/index");
const { errorHandler } = require("./middlewares/error.middleware");
const { notFound } = require("./middlewares/notFound.middleware");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Online Admission API is running" });
});

// Endpoint cho Hộp thư thử nghiệm (Email Sandbox)
app.get("/api/emails-log", (req, res) => {
  try {
    const fs = require("fs");
    const emailLogsDir = path.join(__dirname, "../logs/emails");
    if (!fs.existsSync(emailLogsDir)) {
      return res.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(emailLogsDir);
    const emails = files
      .filter(file => file.endsWith(".html"))
      .map(file => {
        const filePath = path.join(emailLogsDir, file);
        const content = fs.readFileSync(filePath, "utf8");
        
        // Trích xuất metadata từ comment tiêu đề ở đầu file
        const toMatch = content.match(/GỬI ĐẾN:\s*([^\n]+)/);
        const subjectMatch = content.match(/TIÊU ĐỀ:\s*([^\n]+)/);
        const timeMatch = content.match(/THỜI GIAN:\s*([^\n]+)/);

        return {
          filename: file,
          to: toMatch ? toMatch[1].trim() : "unknown",
          subject: subjectMatch ? subjectMatch[1].trim() : "Không tiêu đề",
          time: timeMatch ? timeMatch[1].trim() : new Date().toLocaleString(),
          html: content
        };
      })
      .sort((a, b) => {
        const timeA = parseInt(a.filename.split("_")[1]) || 0;
        const timeB = parseInt(b.filename.split("_")[1]) || 0;
        return timeB - timeA;
      });

    return res.json({ success: true, data: emails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/emails-log", (req, res) => {
  try {
    const fs = require("fs");
    const emailLogsDir = path.join(__dirname, "../logs/emails");
    if (fs.existsSync(emailLogsDir)) {
      const files = fs.readdirSync(emailLogsDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(emailLogsDir, file));
      });
    }
    return res.json({ success: true, message: "Đã dọn dẹp hộp thư thử nghiệm thành công!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
