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
            {
                offer_price: 200000,
                offer_status: null,
                id_user: 1,
                id_product: 1,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                offer_price: 150000,
                offer_status: null,
                id_user: 2,
                id_product: 2,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                offer_price: 200000,
                offer_status: null,
                id_user: 3,
                id_product: 2,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Offers", null, {});
    },
};
