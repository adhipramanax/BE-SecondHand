'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
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

      this.belongsTo(models.Offer, {
        foreignKey: {
          name: 'id_offer'
        }
      })
    }
  }
  History.init({
    id_user: DataTypes.INTEGER,
    id_offer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};