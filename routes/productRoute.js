const express = require("express");
const {
  createProductController,
  productsController,
  singleProductController,
  updateProductController,
  photoController,
  deleteProductController,
  productFilterController,
  productCountcontroller,
  productListController,
  searchProductcontroller,
  relatedProductController,
  categoryProductController,
  braintreeTokenController,
  braintreePaymentController,
} = require("../controllers/productController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const ExpressFormidable = require("express-formidable");

const router = express.Router();

//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  createProductController
);

// get products
router.get("/products", productsController);

// get single product
router.get("/single-product/:slug", singleProductController);

// get photo
router.get("/product-photo/:id", photoController);

//delete product
router.delete("/delete-product/:id", deleteProductController);

// update single product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  updateProductController
);

// filter product
router.post("/product-filter", productFilterController);

// product count
router.get("/product-count", productCountcontroller);

// product per page
router.get("/product-list/:page", productListController);

// search product
router.get("/search/:keyword", searchProductcontroller);

// related product
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise product
router.get("/category-product/:slug", categoryProductController);

//============ payments route =================
// braintree token
router.get("/braintree/token", braintreeTokenController);

// payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

module.exports = router;
