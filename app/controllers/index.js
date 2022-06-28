const authenticationController = require("./authentication.controller");
const ProductController = require("./product.controller");
const offerController = require("./offer.controller");
const categoryController = require("./category.controller");
const historyTransactionController = require("./historyTransaction.controller");

module.exports = {
    authenticationController,
    ProductController,
    offerController,
    categoryController,
    historyTransactionController,
};
