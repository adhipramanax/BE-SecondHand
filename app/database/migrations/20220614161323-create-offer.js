'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      offer_price: {
        type: Sequelize.DOUBLE
      },
      offer_status: {
        type: Sequelize.BOOLEAN // true = offer accepted, false = offer rejected
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      id_product: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Offers');
  }
};