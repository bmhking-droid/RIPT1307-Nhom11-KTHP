module.exports = (sequelize, DataTypes) => {
  const ApplicationDocument = sequelize.define(
    "ApplicationDocument",
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

      documentType: {
        type: DataTypes.ENUM(
          "CCCD",
          "HOC_BA",
          "DIEM_THI",
          "UU_TIEN"
        ),
        allowNull: false,
      },

      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      filePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

      mimeType: {
        type: DataTypes.STRING(100),
      },

      fileSize: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "application_documents",
      timestamps: true,
    }
  );

  ApplicationDocument.associate = (models) => {
    ApplicationDocument.belongsTo(models.Application, {
      foreignKey: "applicationId",
    });
  };

  return ApplicationDocument;
};