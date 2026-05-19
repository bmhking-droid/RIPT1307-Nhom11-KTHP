module.exports = (sequelize, DataTypes) => {
  const AdmissionCombination = sequelize.define(
    "AdmissionCombination",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },

      majorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      subjects: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "admission_combinations",
      timestamps: true,
    },
  );

  AdmissionCombination.associate = (models) => {
    AdmissionCombination.belongsTo(models.Major, {
      foreignKey: "majorId",
    });

    AdmissionCombination.hasMany(models.Application, {
      foreignKey: "combinationId",
    });
  };

  return AdmissionCombination;
};
