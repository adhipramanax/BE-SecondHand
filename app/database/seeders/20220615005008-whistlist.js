'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const timestamp = new Date();

    await queryInterface.bulkInsert('Whistlists', [
      {
        id_user: 1,
        id_product: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_user: 1,
        id_product: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id_user: 2,
        id_product: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Whistlists', null, {});
  }
};
