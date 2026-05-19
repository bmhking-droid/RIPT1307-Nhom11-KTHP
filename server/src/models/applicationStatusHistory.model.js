module.exports = (sequelize, DataTypes) => {
  const ApplicationStatusHistory = sequelize.define(
    "ApplicationStatusHistory",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      applicationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      oldStatus: {
        type: DataTypes.STRING(50),
      },

      newStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      changedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "application_status_history",
      timestamps: true,
    },
  );

  ApplicationStatusHistory.associate = (models) => {
    ApplicationStatusHistory.belongsTo(models.Application, {
      foreignKey: "applicationId",
    });
  };

  return ApplicationStatusHistory;
};
