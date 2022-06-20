const router = require("express").Router();

// Import the controllers or other
const { authJWT } = require('../../../app/middlewares')
const { register, login } = require('../../../app/requests/auth.validator')
const productValidator  = require('../../../app/requests/product.validator')
const { create } = require('../../../app/requests/offer.validator')
const { authenticationController, ProductController, offerController } = require('../../../app/controllers')

// Implement the routes here
router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);

// Management Product
router.get("/product", ProductController.getAllProduct);
router.get("/product/search", ProductController.searchProductByName);
router.get("/product/filter", ProductController.filterByCategory);
router.get("/product/:id", ProductController.getProductById);

// Product by seller
router.post("/seller/product", [ authJWT, productValidator ], ProductController.createProduct);
router.get("/seller/product/offer", [ authJWT ], ProductController.getProductOffered);
router.get("/seller/product/:status", [ authJWT ], ProductController.getProductByStatus);
router.put("/seller/product/:id", [ authJWT ], ProductController.updateProduct);
router.put("/seller/product/status/:id", [ authJWT ], ProductController.updateStatusProduct);
router.delete("/seller/product/:id", [ authJWT ], ProductController.deleteProduct);


// Management offer
router.post('/offer', [ authJWT, create ], offerController.offerUser)
router.put('/offer/:id', [ authJWT ], offerController.updateStatus)

module.exports = router;
