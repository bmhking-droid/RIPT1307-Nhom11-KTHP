"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("majors", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      universityId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "universities",
          key: "id",
        },
        onDelete: "CASCADE",
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

      quota: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("majors");
  },
};
