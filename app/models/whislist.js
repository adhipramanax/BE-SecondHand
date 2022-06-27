'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Whistlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'id_user'
        }
      }),

      this.belongsTo(models.Product, {
        foreignKey: {
          name: 'id_product'
        }
      })
    }
  }
  Whistlist.init({
    id_user: DataTypes.INTEGER,
    id_product: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Whislist',
  });
  return Whistlist;
};