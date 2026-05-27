const { sequelize } = require("../models");

exports.countByStatus = async () => {
  const [data] = await sequelize.query(`
    SELECT status, COUNT(*) as total FROM applications GROUP BY status
  `);
  return data;
};

exports.countByUniversity = async () => {
  const [data] = await sequelize.query(`
    SELECT u.name, COUNT(a.id) as total
    FROM applications a
    JOIN universities u ON a.universityId = u.id
    GROUP BY u.name
  `);
  return data;
};

exports.countByMajor = async () => {
  const [data] = await sequelize.query(`
    SELECT m.name, COUNT(a.id) as total
    FROM applications a
    JOIN majors m ON a.majorId = m.id
    GROUP BY m.name
  `);
  return data;
};