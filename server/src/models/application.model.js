// Application model - represents candidate applications with relationships to universities, majors, and documents
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      universityId: { type: DataTypes.UUID, allowNull: false },
      majorId: { type: DataTypes.UUID, allowNull: false },
      combinationId: { type: DataTypes.UUID, allowNull: false },
      roundId: { type: DataTypes.UUID, allowNull: false },
      totalScore: { type: DataTypes.DECIMAL(5, 2) },
      status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
      reviewedAt: { type: DataTypes.DATE },
      reviewedBy: { type: DataTypes.UUID }
    },
    {
      tableName: "applications",
      timestamps: true,
      createdAt: 'submittedAt',
      updatedAt: false
    },
  );

  Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: "userId" });
    Application.belongsTo(models.University, { foreignKey: "universityId" });
    Application.belongsTo(models.Major, { foreignKey: "majorId" });
    Application.belongsTo(models.AdmissionCombination, { foreignKey: "combinationId" });
    Application.belongsTo(models.AdmissionRound, { foreignKey: "roundId" });
    Application.hasMany(models.ApplicationStatusHistory, { foreignKey: "applicationId", as: "statusHistories" });
    Application.hasMany(models.ApplicationDocument, { foreignKey: "applicationId", as: "documents" });
  };
  return Application;
};