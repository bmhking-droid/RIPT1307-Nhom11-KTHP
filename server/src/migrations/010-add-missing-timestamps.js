// Migration to add missing timestamp columns (createdAt/updatedAt) to multiple tables
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "universities",
        "updatedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "majors",
        "createdAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "majors",
        "updatedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "admission_combinations",
        "createdAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "admission_combinations",
        "updatedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "admission_rounds",
        "updatedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "application_documents",
        "createdAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "application_documents",
        "updatedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "application_status_history",
        "createdAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "application_status_history",
        "updatedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("universities", "updatedAt", {
        transaction,
      });
      await queryInterface.removeColumn("majors", "createdAt", {
        transaction,
      });
      await queryInterface.removeColumn("majors", "updatedAt", {
        transaction,
      });
      await queryInterface.removeColumn("admission_combinations", "createdAt", {
        transaction,
      });
      await queryInterface.removeColumn("admission_combinations", "updatedAt", {
        transaction,
      });
      await queryInterface.removeColumn("admission_rounds", "updatedAt", {
        transaction,
      });
      await queryInterface.removeColumn("application_documents", "createdAt", {
        transaction,
      });
      await queryInterface.removeColumn("application_documents", "updatedAt", {
        transaction,
      });
      await queryInterface.removeColumn("application_status_history", "createdAt", {
        transaction,
      });
      await queryInterface.removeColumn("application_status_history", "updatedAt", {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
