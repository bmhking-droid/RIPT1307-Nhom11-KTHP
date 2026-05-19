"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("application_status_history", {
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

      oldStatus: {
        type: Sequelize.STRING(50),
      },

      newStatus: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      changedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("application_status_history");
  },
};
