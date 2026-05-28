"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "universities",
      [
        {
          name: "Đại Học Bách Khoa Hà Nội",
          code: "HUST",
          address: "Hà Nội",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "Đại Học Quốc Gia Hà Nội",
          code: "VNU",
          address: "Hà Nội",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "Học Viện Công Nghệ Bưu Chính Viễn Thông",
          code: "PTIT",
          address: "Hà Nội",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("universities", null, {});
  },
};
