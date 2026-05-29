module.exports = (sequelize, DataTypes) => {
  const MajorCombination = sequelize.define(
    "MajorCombination",
    {
      majorId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      combinationId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "major_combination",
      timestamps: false,
    }
  );

  return MajorCombination;
};
