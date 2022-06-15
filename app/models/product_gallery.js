'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: {
          name: 'id_product'
        }
      })
    }
  }
  Product_Gallery.init({
    url_photo: DataTypes.STRING,
    id_product: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product_Gallery',
  });
  return Product_Gallery;
};