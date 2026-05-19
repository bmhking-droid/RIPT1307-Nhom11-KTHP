module.exports = (sequelize, DataTypes) => {
  const AdmissionRound = sequelize.define(
    "AdmissionRound",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      universityId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "admission_rounds",
      timestamps: true,
    },
  );

  AdmissionRound.associate = (models) => {
    AdmissionRound.belongsTo(models.University, {
      foreignKey: "universityId",
    });

    AdmissionRound.hasMany(models.Application, {
      foreignKey: "admissionRoundId",
    });
  };

  return AdmissionRound;
};
