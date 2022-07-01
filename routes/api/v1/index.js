const router = require("express").Router();

// Import the controllers or other
const { authJWT, upload } = require("../../../app/middlewares");
const { register, login } = require("../../../app/requests/auth.validator");
const { createProduct } = require("../../../app/requests/product.validator");
const { create } = require("../../../app/requests/offer.validator");
const { authenticationController, ProductController, offerController, categoryController, historyTransactionController, WishlistController } = require("../../../app/controllers");

// Implement the routes here
router.post("/auth/login", login, authenticationController.login);
router.post("/auth/register", register, authenticationController.register);

// Management Product
router.get("/product", ProductController.getAllProduct);
router.get("/product/search", ProductController.searchProductByName);
router.get("/product/filter", ProductController.filterByCategory);
router.get("/product/:id", ProductController.getProductById);

// Product by seller
router.get("/seller/product", [authJWT], ProductController.getProductSeller);
router.post("/seller/product", [authJWT, upload.array("image")], ProductController.createProduct);
router.get("/seller/product/sold", [authJWT], ProductController.getProductSold);
router.get("/seller/product/offer", [authJWT], ProductController.getProductOffered);
router.get("/seller/product/offer/:id", [authJWT], ProductController.getDetailProductOffered);
router.put("/seller/product/:id", [authJWT, upload.array("image")], ProductController.updateProduct);
router.put("/seller/product/status/:id", [authJWT], ProductController.updateStatusProduct);
router.delete("/seller/product/:id", [authJWT], ProductController.deleteProduct);

// Management offer
router.post("/offer", [authJWT, create], offerController.offerUser);
router.get("/offer/:id", [authJWT], offerController.showOfferProduct);
router.put("/offer/:id", [authJWT], offerController.updateStatus);
router.get("/offer/history/:id", [authJWT], historyTransactionController.offerHistory);

// Management Category
router.get("/categories", [authJWT], categoryController.getAllCategory);

//Wishlist
router.get("/wishlist/:id", WishlistController.getAllWishlist);
router.post("/wishlist/:id", WishlistController.createWishlist);
module.exports = router;
