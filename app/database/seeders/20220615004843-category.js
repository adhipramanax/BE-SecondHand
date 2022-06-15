'use strict';

const names = [
  "Hobi",
  "Kendaraan",
  "Baju",
  "Elektronik",
  "Kesehatan"
]

module.exports = {
  async up (queryInterface, Sequelize) {
    const timestamp = new Date();

    const categories = names.map((name) => ({
      name,
      createdAt: timestamp,
      updatedAt: timestamp,
    }))

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
