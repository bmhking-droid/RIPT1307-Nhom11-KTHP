module.exports = (sequelize, DataTypes) => {
  const ApplicationDocument = sequelize.define(
    "ApplicationDocument",
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

      documentType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      fileUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      originalName: {
        type: DataTypes.STRING(255),
      },

      fileSize: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "application_documents",
      timestamps: true,
    },
  );

  ApplicationDocument.associate = (models) => {
    ApplicationDocument.belongsTo(models.Application, {
      foreignKey: "applicationId",
    });
  };

  return ApplicationDocument;
};
