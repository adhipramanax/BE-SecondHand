const router = require("express").Router();

// Import the controllers or other
const { authJWT, upload } = require('../../../app/middlewares')
const { register, login } = require('../../../app/requests/auth.validator')
const { createProduct }  = require('../../../app/requests/product.validator')
const { create } = require('../../../app/requests/offer.validator')
const { authenticationController, ProductController, offerController, categoryController } = require('../../../app/controllers')

// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);

// Management Product
router.get("/product", ProductController.getAllProduct);
router.get("/product/search", ProductController.searchProductByName);
router.get("/product/filter", ProductController.filterByCategory);
router.get("/product/:id", ProductController.getProductById);

// Product by seller
router.post("/seller/product", [authJWT, upload.array('image')], ProductController.createProduct);
router.get("/seller/product/sold", [ authJWT ], ProductController.getProductSold);
router.get("/seller/product/offer", [ authJWT ], ProductController.getProductOffered);
router.get("/seller/product/offer/:id", [ authJWT ], ProductController.getDetailProductOffered);
router.get("/seller/product/:status", [ authJWT ], ProductController.getProductByStatus);
router.put("/seller/product/:id", [ authJWT ], ProductController.updateProduct);
router.put("/seller/product/status/:id", [ authJWT ], ProductController.updateStatusProduct);
router.delete("/seller/product/:id", [ authJWT ], ProductController.deleteProduct);


// Management offer
router.post('/offer', [ authJWT, create ], offerController.offerUser)
router.get('/offer/:id', [ authJWT ], offerController.showOfferProduct)
router.put('/offer/:id', [ authJWT ], offerController.updateStatus)

router.get('/categories', categoryController.getAllCategory)

module.exports = router;
