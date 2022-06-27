'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_Product extends Model {
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
      }),

      this.belongsTo(models.Category, {
        foreignKey: {
          name: 'id_category'
        }
      })
    }
  }
  Detail_Product.init({
    id_product: DataTypes.INTEGER,
    id_category: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Detail_Product',
  });
  return Detail_Product;
};