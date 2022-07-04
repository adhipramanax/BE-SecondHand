'use strict';

const converToSlug = require("../../helpers/conversToSlug");

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
      slug: converToSlug(name),
      createdAt: timestamp,
      updatedAt: timestamp,
    }))

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
