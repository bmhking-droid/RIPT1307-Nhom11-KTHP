module.exports = (sequelize, DataTypes) => {
  const Major = sequelize.define(
    "Major",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      universityId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      code: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },

      quota: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "majors",
      timestamps: true,
    },
  );

  Major.associate = (models) => {
    Major.belongsTo(models.University, {
      foreignKey: "universityId",
    });

    Major.hasMany(models.AdmissionCombination, {
      foreignKey: "majorId",
      onDelete: "CASCADE",
    });

    Major.hasMany(models.Application, {
      foreignKey: "majorId",
    });
  };

  return Major;
};
