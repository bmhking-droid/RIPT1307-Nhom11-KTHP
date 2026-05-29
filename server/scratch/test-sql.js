const { Sequelize, DataTypes } = require('sequelize');

async function test() {
  const sequelize = new Sequelize('sqlite::memory:', { logging: console.log });

  // 1. Dinh nghia MajorCombination
  const MajorCombination = sequelize.define(
    "MajorCombination",
    {
      majorId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      combinationId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    },
    { tableName: "major_combination", timestamps: false }
  );

  // 2. Dinh nghia Major
  const Major = sequelize.define(
    "Major",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "majors" }
  );

  // 3. Dinh nghia AdmissionCombination
  const AdmissionCombination = sequelize.define(
    "AdmissionCombination",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      code: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "admission_combinations" }
  );

  // 4. Thiet lap lien ket
  Major.belongsToMany(AdmissionCombination, {
    through: MajorCombination,
    foreignKey: "majorId",
    otherKey: "combinationId",
  });

  AdmissionCombination.belongsToMany(Major, {
    through: MajorCombination,
    foreignKey: "combinationId",
    otherKey: "majorId",
  });

  await sequelize.sync();

  console.log('\n--- SYSTEM DRY-RUN: CREATING MAJOR AND ASSOCIATING COMBINATIONS ---');
  const major = await Major.create({ name: 'CNTT', code: '7480201' });
  const combo = await AdmissionCombination.create({ code: 'A00' });
  
  console.log('\n--- LOOK AT GENERATED SQL FOR setAdmissionCombinations: ---');
  await major.setAdmissionCombinations([combo.id]);
  
  console.log('\n--- SUCCESS: VERIFIED! ---');
  await sequelize.close();
}

test().catch(err => console.error(err));
