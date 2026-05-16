"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("application_documents", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      applicationId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "applications",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      documentType: {
        type: Sequelize.ENUM(
          "CCCD",
          "HOC_BA",
          "DIEM_THI",
          "UU_TIEN"
        ),
        allowNull: false,
      },

      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      filePath: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      mimeType: {
        type: Sequelize.STRING(100),
      },

      fileSize: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("application_documents");
  },
};