const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const dbConfig = require("../configs/database.js")[env];

const sequelize = new Sequelize(
  dbConfig.database || process.env.DB_NAME,
  dbConfig.username || process.env.DB_USER,
  dbConfig.password || process.env.DB_PASSWORD || "",
  {
    ...dbConfig,
    host: dbConfig.host || process.env.DB_HOST,
    port: Number(dbConfig.port) || Number(process.env.DB_PORT) || 3306,
  }
);

const db = { sequelize, Sequelize };

fs.readdirSync(__dirname)
  .filter((file) => file !== path.basename(__filename) && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    // Tự động kiểm tra và bổ sung các cột province, score, cccd vào bảng profiles nếu thiếu
    try {
      const [columns] = await sequelize.query("SHOW COLUMNS FROM profiles");
      const columnNames = columns.map(c => c.Field);
      
      if (!columnNames.includes("province")) {
        await sequelize.query("ALTER TABLE profiles ADD COLUMN province VARCHAR(100) NULL AFTER address;");
        console.log("🛠️ [AUTO SCHEMA FIX] Added column 'province' to 'profiles' table.");
      }
      if (!columnNames.includes("score")) {
        await sequelize.query("ALTER TABLE profiles ADD COLUMN score DECIMAL(5,2) NULL AFTER priorityGroup;");
        console.log("🛠️ [AUTO SCHEMA FIX] Added column 'score' to 'profiles' table.");
      }
      if (!columnNames.includes("cccd")) {
        await sequelize.query("ALTER TABLE profiles ADD COLUMN cccd VARCHAR(20) NULL UNIQUE AFTER fullName;");
        console.log("🛠️ [AUTO SCHEMA FIX] Added column 'cccd' to 'profiles' table.");
      }
    } catch (dbErr) {
      console.error("💥 [AUTO SCHEMA FIX ERROR]:", dbErr.message);
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = { ...db, connectDB };
