module.exports = (sequelize, DataTypes) => {
  const AdmissionCombination = sequelize.define(
    "AdmissionCombination",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },

      subjects: {
        type: DataTypes.STRING(100),
      },

      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "admission_combinations",
      timestamps: true,
    },
  );

  AdmissionCombination.associate = (models) => {
    AdmissionCombination.belongsToMany(models.Major, {
      through: "major_combination",
      foreignKey: "combinationId",
      otherKey: "majorId",
    });

    AdmissionCombination.hasMany(models.Application, {
      foreignKey: "combinationId",
    });
  };

  return AdmissionCombination;
};
