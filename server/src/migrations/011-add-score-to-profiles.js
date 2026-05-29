"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột score vào bảng profiles nếu chưa tồn tại
    const tableInfo = await queryInterface.describeTable("profiles");
    if (!tableInfo.score) {
      await queryInterface.addColumn("profiles", "score", {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      });
      console.log("🛠️ [MIGRATION] Added 'score' column to 'profiles' table.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("profiles");
    if (tableInfo.score) {
      await queryInterface.removeColumn("profiles", "score");
    }
  },
};
