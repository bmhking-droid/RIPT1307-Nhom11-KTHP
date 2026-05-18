const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      applicationCode: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      universityId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      majorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      combinationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      admissionRoundId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      score: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
      },

      priorityType: {
        type: DataTypes.STRING(100),
      },

      status: {
        type: DataTypes.ENUM(
          "DRAFT",
          "SUBMITTED",
          "PENDING",
          "APPROVED",
          "REJECTED",
        ),
        defaultValue: APPLICATION_STATUS.DRAFT,
      },

      rejectionReason: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "applications",
      timestamps: true,
    },
  );

  Application.associate = (models) => {
    Application.belongsTo(models.User, {
      foreignKey: "userId",
    });

    Application.belongsTo(models.University, {
      foreignKey: "universityId",
    });

    Application.belongsTo(models.Major, {
      foreignKey: "majorId",
    });

    Application.belongsTo(models.AdmissionCombination, {
      foreignKey: "combinationId",
    });

    Application.belongsTo(models.AdmissionRound, {
      foreignKey: "admissionRoundId",
    });

    Application.hasMany(models.ApplicationDocument, {
      foreignKey: "applicationId",
    });

    Application.hasMany(models.ApplicationStatusHistory, {
      foreignKey: "applicationId",
    });
  };

  return Application;
};
