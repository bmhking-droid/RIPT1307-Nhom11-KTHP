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

    // Auto Schema Fix: Check and add missing OTP columns to users table
    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable("users");
    
    if (!tableInfo.otpCode) {
      console.log("Adding otpCode column to users table...");
      await queryInterface.addColumn("users", "otpCode", {
        type: Sequelize.STRING(50),
        allowNull: true,
      });
    }
    if (!tableInfo.otpExpiresAt) {
      console.log("Adding otpExpiresAt column to users table...");
      await queryInterface.addColumn("users", "otpExpiresAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = { ...db, connectDB };
