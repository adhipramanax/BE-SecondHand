"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const timestamp = new Date();

        await queryInterface.bulkInsert("Offers", [
            {
                offer_price: 100000,
                offer_status: null,
                id_user: 1,
                id_product: 1,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Offers", null, {});
    },
};
