"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("universities", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      address: {
        type: Sequelize.STRING(500),
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("universities");
  },
};