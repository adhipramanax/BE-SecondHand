'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const timestamp = new Date();

    await queryInterface.bulkInsert('Product_Galleries', [
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        url_photo: 'https://via.placeholder.com/150',
        id_product: 4,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Product_Galleries', null, {});
  }
};
