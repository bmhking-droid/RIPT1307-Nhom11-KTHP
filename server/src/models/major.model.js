module.exports = (sequelize, DataTypes) => {
  const Major = sequelize.define(
    "Major",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      universityId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
      },

      quota: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      minScore: {
        type: DataTypes.DECIMAL(4, 2),
      },

      description: {
        type: DataTypes.TEXT,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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

    Major.hasMany(models.Application, {
      foreignKey: "majorId",
    });

    Major.belongsToMany(models.AdmissionCombination, {
      through: "major_combination",
      foreignKey: "majorId",
    });
  };

  return Major;
};
