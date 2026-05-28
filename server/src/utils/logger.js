const path = require("path");

let logger;

try {
  const winston = require("winston");

  logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(__dirname, "../../logs/error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(__dirname, "../../logs/combined.log"),
      }),
    ],
  });

  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }
} catch (error) {
  const noop = () => {};
  logger = {
    info: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug
      ? console.debug.bind(console)
      : console.log.bind(console),
  };
}

module.exports = logger;
