module.exports = (sequelize, DataTypes) => {
  const AdmissionRound = sequelize.define(
    "AdmissionRound",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'ended'),
        defaultValue: 'upcoming',
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
    AdmissionRound.hasMany(models.Application, {
      foreignKey: "roundId",
    });
  };

  return AdmissionRound;
};
