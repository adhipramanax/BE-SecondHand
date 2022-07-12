const router = require("express").Router();

// Import the controllers or other
const { authJWT, upload } = require("../../../app/middlewares");
const { register, login } = require("../../../app/requests/auth.validator");
const { createProduct } = require("../../../app/requests/product.validator");
const { create } = require("../../../app/requests/offer.validator");
const { authenticationController, ProductController, offerController, categoryController, historyTransactionController, profilController, WishlistController } = require("../../../app/controllers");

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
router.get("/offer/history", [authJWT], historyTransactionController.offerHistory);
router.post("/offer", [authJWT, create], offerController.offerUser);
router.get("/offer/:id", [authJWT], offerController.showOfferProduct);
router.put("/offer/:id", [authJWT], offerController.updateStatus);

//Management user
router.get('/profile/', [authJWT], profilController.findUser)
router.put('/profile/:id', [authJWT, upload.single('image')], profilController.update)

// Management Category
router.get("/categories", categoryController.getAllCategory);

// profil user 
router.put('/profile/:id', profilController.update);

//Wishlist
router.get("/wishlist", [authJWT], WishlistController.getAllWishlist);
router.post("/wishlist", [authJWT], WishlistController.createWishlist);

module.exports = router;
