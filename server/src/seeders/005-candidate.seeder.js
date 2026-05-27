const bcrypt = require("bcryptjs");

const USER_ID = "b2c3d4e5-f6a7-8901-bcde-f12345678901";

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("user01@", 10);

    await queryInterface.bulkInsert("users", [
      {
        id: USER_ID,
        email: "user01@gmail.com",
        password: hashedPassword,
        role: "CANDIDATE",
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("profiles", [
      {
        id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
        userId: USER_ID,
        fullName: "Người dùng 01",
        cccd: null,
        dateOfBirth: null,
        gender: null,
        phone: null,
        address: null,
        priorityGroup: "KV3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✅ Candidate user01@gmail.com seeded successfully");
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("profiles", { userId: USER_ID });
    await queryInterface.bulkDelete("users", { email: "user01@gmail.com" });
  },
};
