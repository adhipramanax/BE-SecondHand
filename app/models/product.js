'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Detail_Product, {
        foreignKey: {
          name: 'id'
        }
      }),

      this.hasMany(models.Product_Gallery, {
        foreignKey: {
          name: 'id'
        }
      }),

      this.hasMany(models.Whistlist, {
        foreignKey: {
          name: 'id'
        }
      }),

      this.hasOne(models.Offer, {
        foreignKey: {
          name: 'id'
        }
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    description: DataTypes.TEXT,
    status_product: DataTypes.BOOLEAN,
    status_sell: DataTypes.BOOLEAN,
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};