'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const timestamp = new Date();

    await queryInterface.bulkInsert('Products', [
      {
        name: 'Product 1',
        price: 100000,
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
        status_product: true,
        status_sell: false,
        id_user: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'Product 2',
        price: 200000,
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
        status_product: true,
        status_sell: false,
        id_user: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'Product 3',
        price: 300000,
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
        status_product: true,
        status_sell: false,
        id_user: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        name: 'Product 4',
        price: 400000,
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
        status_product: true,
        status_sell: true,
        id_user: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
