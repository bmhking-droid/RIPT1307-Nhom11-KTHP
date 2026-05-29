const { sequelize } = require('../src/models');

async function run() {
  try {
    const [results] = await sequelize.query("DESCRIBE applications");
    console.log("Applications table columns:");
    console.table(results);
    
    const [resultsHistory] = await sequelize.query("DESCRIBE application_status_history");
    console.log("ApplicationStatusHistory table columns:");
    console.table(resultsHistory);
  } catch (error) {
    console.error("Error describing table:", error.message);
  } finally {
    await sequelize.close();
  }
}

run();
