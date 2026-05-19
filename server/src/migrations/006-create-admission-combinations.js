"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admission_combinations", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      majorId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "majors",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      subjects: {
        type: Sequelize.JSON,
        allowNull: false,
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
    await queryInterface.dropTable("admission_combinations");
  },
};
