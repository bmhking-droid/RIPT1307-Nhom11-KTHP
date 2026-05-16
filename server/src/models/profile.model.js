module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cccd: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Nam", "Nữ", "Khác"),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      priorityGroup: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "profiles",
      timestamps: true,
    },
  );

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Profile;
};
