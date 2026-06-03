module.exports = (sequelize, DataTypes) => {
  const AuthOtp = sequelize.define(
    "AuthOtp",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.ENUM("PASSWORD_RESET", "EMAIL_VERIFICATION"),
        allowNull: false,
        defaultValue: "PASSWORD_RESET",
      },
      otpHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resetTokenHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { tableName: "auth_otps", timestamps: true },
  );

  AuthOtp.associate = (models) => {
    AuthOtp.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return AuthOtp;
};
