module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM("CANDIDATE", "ADMIN"), defaultValue: "CANDIDATE" },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: "users", timestamps: true },
  );

  User.associate = (models) => {
    User.hasOne(models.Profile, { foreignKey: "userId", as: "profile" });
    User.hasMany(models.Application, { foreignKey: "userId", as: "applications" });
  };
  return User;
};
