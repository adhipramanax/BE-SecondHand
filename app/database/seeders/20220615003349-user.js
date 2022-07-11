'use strict';

require('dotenv').config()
const bcrypt = require("bcryptjs");

const names = [
  "Bagus",
  "Panji",
  "Lidya",
  "Adbullah",
  "Helena",
  "Dhefanza"
]

module.exports = {
  async up (queryInterface, Sequelize) {
    const password = "123456";
    const salt = process.env.SALT;
    const encryptedPassword = bcrypt.hashSync(password + salt, 10);
    const timestamp = new Date();

    const users = names.map((name) => ({
      name,
      email: `${name.toLowerCase()}@binar.co.id`,
      password: encryptedPassword,
      city: "Jakarta",
      address: "Jl. Kebon Kacang No.1 RT.01/RW.01, Desa Kebon Kacang, Kec. Kebon Kacang, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12780",
      phone_number: "081212121212",
      url_photo: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png",
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
