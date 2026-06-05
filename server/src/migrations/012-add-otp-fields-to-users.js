"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("users");
    
    if (!tableInfo.otpCode) {
      await queryInterface.addColumn("users", "otpCode", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log("🛠️ [MIGRATION] Added 'otpCode' column to 'users' table.");
    }
    
    if (!tableInfo.otpExpiresAt) {
      await queryInterface.addColumn("users", "otpExpiresAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
      console.log("🛠️ [MIGRATION] Added 'otpExpiresAt' column to 'users' table.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("users");
    
    if (tableInfo.otpCode) {
      await queryInterface.removeColumn("users", "otpCode");
      console.log("🛠️ [MIGRATION] Removed 'otpCode' column from 'users' table.");
    }
    
    if (tableInfo.otpExpiresAt) {
      await queryInterface.removeColumn("users", "otpExpiresAt");
      console.log("🛠️ [MIGRATION] Removed 'otpExpiresAt' column from 'users' table.");
    }
  },
};
