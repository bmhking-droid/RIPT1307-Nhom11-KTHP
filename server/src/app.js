// Express server setup with middleware for CORS, security, and error handling
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
    origin: "http://localhost:8000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Online Admission API is running" });
});

app.use("/api", routes);

// BUG FIX: Mount notFound middleware before errorHandler to return 404 in correct format
app.use(notFound);
app.use(errorHandler);

module.exports = app;