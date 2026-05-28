"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "majors",
      [
        {
          universityId: 1,
          name: "Công nghệ thông tin",
          code: "CNTT",
          quota: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          universityId: 1,
          name: "Khoa học máy tính",
          code: "KHMT",
          quota: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          universityId: 2,
          name: "An toàn thông tin",
          code: "ATTT",
          quota: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("majors", null, {});
  },
};
