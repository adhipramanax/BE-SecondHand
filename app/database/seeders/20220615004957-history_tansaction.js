'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const timestamp = new Date();

    await queryInterface.bulkInsert('Histories', [
      {
        id_user: 1,
        id_offer: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Histories', null, {});
  }
};
