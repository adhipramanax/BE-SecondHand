'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.History, {
        foreignKey: {
          name: 'id'
        }
      }),

      this.hasMany(models.Whislist, {
        foreignKey: {
          name: 'id'
        }
      }),

      this.hasMany(models.Offer, {
        foreignKey: {
          name: 'id'
        }
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    url_photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};