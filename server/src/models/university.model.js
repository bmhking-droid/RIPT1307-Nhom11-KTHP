module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define(
    "University",
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

      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      address: {
        type: DataTypes.STRING(500),
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "universities",
      timestamps: true,
    }
  );

  University.associate = (models) => {
    University.hasMany(models.Major, {
      foreignKey: "universityId",
    });

    University.hasMany(models.Application, {
      foreignKey: "universityId",
    });
  };

  return University;
};