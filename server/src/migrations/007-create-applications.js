"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applications", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      applicationCode: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      universityId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "universities",
          key: "id",
        },
      },

      majorId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "majors",
          key: "id",
        },
      },

      combinationId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "admission_combinations",
          key: "id",
        },
      },

      admissionRoundId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "admission_rounds",
          key: "id",
        },
      },

      score: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },

      priorityType: {
        type: Sequelize.STRING(100),
      },

      status: {
        type: Sequelize.ENUM(
          "DRAFT",
          "SUBMITTED",
          "PENDING",
          "APPROVED",
          "REJECTED",
        ),
        defaultValue: "DRAFT",
      },

      rejectionReason: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("applications");
  },
};
