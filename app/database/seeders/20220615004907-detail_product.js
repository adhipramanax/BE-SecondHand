'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const timestamp = new Date();

    await queryInterface.bulkInsert('Detail_Products', [
      {
        id_product: 1,
        id_category: 1,
        createdAt: timestamp,
        updatedAt: timestamp 
      },
      {
        id_product: 1,
        id_category: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 1,
        id_category: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 1,
        id_category: 4,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 1,
        id_category: 5,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 2,
        id_category: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 2,
        id_category: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 2,
        id_category: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 3,
        id_category: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 3,
        id_category: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 4,
        id_category: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_product: 4,
        id_category: 4,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Detail_Products', null, {});
  }
};
