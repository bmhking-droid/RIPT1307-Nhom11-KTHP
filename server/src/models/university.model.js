module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define(
    "University",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
      },
      description: {
        type: DataTypes.TEXT,
      },
      logoUrl: {
        type: DataTypes.TEXT,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "universities",
      timestamps: true,
    },
  );

  University.associate = (models) => {
    University.hasMany(models.Major, {
      foreignKey: "universityId",
      onDelete: "CASCADE",
    });

    University.hasMany(models.Application, {
      foreignKey: "universityId",
    });
  };

  return University;
};
