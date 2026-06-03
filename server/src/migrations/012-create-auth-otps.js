"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("auth_otps", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      purpose: {
        type: Sequelize.ENUM("PASSWORD_RESET", "EMAIL_VERIFICATION"),
        allowNull: false,
        defaultValue: "PASSWORD_RESET",
      },
      otpHash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      resetTokenHash: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      verifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resetTokenExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex("auth_otps", ["userId", "purpose", "usedAt", "expiresAt"]);
    await queryInterface.addIndex("auth_otps", ["resetTokenHash"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("auth_otps");
  },
};
