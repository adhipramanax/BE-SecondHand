const authenticationController = require('./authentication.controller');
const ProductController = require('./product.controller');
const offerController = require('./offer.controller');
const categoryController = require('./category.controller');

module.exports = {
  authenticationController,
  offerController,
  ProductController,
  categoryController
}