module.exports = (sequelize, DataTypes) => {
  const ApplicationStatusHistory = sequelize.define(
    "ApplicationStatusHistory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      applicationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      oldStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      },

      newStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
      },

      reason: {
        type: DataTypes.TEXT,
      },

      changedBy: {
        type: DataTypes.UUID,
      },
    },
    {
      tableName: "application_status_history",
      timestamps: true,
      createdAt: 'changedAt',
      updatedAt: false,
    },
  );

  ApplicationStatusHistory.associate = (models) => {
    ApplicationStatusHistory.belongsTo(models.Application, {
      foreignKey: "applicationId",
    });
  };

  return ApplicationStatusHistory;
};
