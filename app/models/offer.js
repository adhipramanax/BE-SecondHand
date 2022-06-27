'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.History, {
        foreignKey: {
          name: 'id_offer'
        }
      }),

      this.belongsTo(models.Product, {
        foreignKey: {
          name: 'id_product'
        }
      }),

      this.belongsTo(models.User, {
        foreignKey: {
          name: 'id_user'
        }
      })
    }
  }
  Offer.init({
    offer_price: DataTypes.DOUBLE,
    offer_status: DataTypes.BOOLEAN,
    id_user: DataTypes.INTEGER,
    id_product: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};