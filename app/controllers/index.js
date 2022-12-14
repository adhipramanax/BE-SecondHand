const authenticationController = require("./authentication.controller");
const ProductController = require("./product.controller");
const offerController = require("./offer.controller");
const categoryController = require("./category.controller");
const historyTransactionController = require("./historyTransaction.controller");
const profilController = require("./profile.controller");
const WishlistController = require("./wishlist.controller");

module.exports = {
  authenticationController,
  ProductController,
  offerController,
  categoryController,
  historyTransactionController,
  profilController,
  WishlistController
};
