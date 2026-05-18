module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("CANDIDATE", "ADMIN", "SUPER_ADMIN"),
        defaultValue: "CANDIDATE",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: false,
    },
  );

  User.associate = (models) => {
    User.hasOne(models.Profile, { foreignKey: "userId", as: "profile" });
    User.hasMany(models.Application, {
      foreignKey: "userId",
      as: "applications",
    });
    User.hasMany(models.ApplicationStatusHistory, {
      foreignKey: "changedBy",
      as: "changedHistories",
    });
  };

  return User;
};
