const router = require("express").Router();

// Import the controllers or other
const ProductController = require("../../../app/controllers/product.controller");
const productValidator  = require('../../../app/requests/product.validator')

// Implement the routes here
router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Management Product
router.post("/product", productValidator, ProductController.createProduct);
router.get("/product", ProductController.getAllProduct);
router.put("/product/:id", ProductController.updateProduct);
router.delete("/product/:id", ProductController.deleteProduct);
router.get("/product/:id", ProductController.getProductById);

module.exports = router;
