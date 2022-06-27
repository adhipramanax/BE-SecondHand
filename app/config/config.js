require("dotenv").config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "postgrest",
        // make dialect
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: `${process.env.DB_NAME}_test`,
        host: process.env.DB_HOST,
        dialect: "postgrest",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: `${process.env.DB_NAME}_prod`,
        host: process.env.DB_HOST,
        dialect: "postgrest",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
