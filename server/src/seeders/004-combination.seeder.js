"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "admission_combinations",
      [
        {
          code: "A00",
          subjects: JSON.stringify(["Toán", "Lý", "Hóa"]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          code: "A01",
          subjects: JSON.stringify(["Toán", "Lý", "Anh"]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          code: "D01",
          subjects: JSON.stringify(["Toán", "Văn", "Anh"]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("admission_combinations", null, {});
  },
};
