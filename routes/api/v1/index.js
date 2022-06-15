const router = require("express").Router();

// Import the controllers or other
const ProductController = require("../../../app/controllers/product.controller");
const productValidator  = require('../../../app/requests/product.validator')
const authenticationController = require('../../../app/controllers/authentication.controller');
const { authJWT } = require('../../../app/middlewares')
const { register, login } = require('../../../app/requests/auth.validator')
const { create } = require('../../../app/requests/offer.validator')
const { offerController } = require('../../../app/controllers')

// Implement the routes here
router.get("/", (req, res) => {
  res.send("Hello World!");
});


// Implement the routes here
router.post('/auth/login', login, authenticationController.login);
router.post('/auth/register', register, authenticationController.register);

router.post('/offer', [ authJWT, create ], offerController.offerUser)
router.put('/offer/:id', [ authJWT ], offerController.updateStatus)

// Management Product
router.post("/product", [ authJWT, productValidator ], ProductController.createProduct);
router.get("/product", ProductController.getAllProduct);
router.put("/product/:id", [ authJWT ], ProductController.updateProduct);
router.get("/product/:id", ProductController.getProductById);

module.exports = router;
