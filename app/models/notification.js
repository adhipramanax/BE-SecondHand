'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notification.init({
    id_user: DataTypes.INTEGER,
    id_product: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'notification',
  });
  return notification;
};