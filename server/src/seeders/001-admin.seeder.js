const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await queryInterface.bulkInsert("users", [
      {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        email: "admin@admission.edu.vn",
        password: hashedPassword,
        role: "super_admin",
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✅ Admin account seeded successfully");
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", {
      email: "admin@admission.edu.vn",
    });
  },
};
