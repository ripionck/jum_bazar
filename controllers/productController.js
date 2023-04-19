const fs = require("fs");
const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const braintree = require("braintree");
const Order = require("../models/orderModel");
require("dotenv").config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// create product
const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields; // contains non-file fields
    const { photo } = req.files; // contains files
    switch (true) {
      case !name:
        return res.status(500).send({ mesage: "Name is required" });
      case !description:
        return res.status(500).send({ mesage: "Description is required" });
      case !category:
        return res.status(500).send({ mesage: "Category is required" });
      case !price:
        return res.status(500).send({ mesage: "Price is required" });
      case !quantity:
        return res.status(500).send({ mesage: "Quantity is required" });
      case !photo && photo.size > 10000:
        return res
          .status(500)
          .send({ mesage: "Photo is required and should be less than 1mb" });
    }
    const products = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating product",
    });
  }
};

// get products
const productsController = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all product",
    });
  }
};

// get single product
const singleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single product",
    });
  }
};

// get photo
const photoController = async (req, res) => {
  try {
    const productPhoto = await Product.findById(req.params.id).select("photo");
    if (productPhoto.photo.data) {
      res.set("Content-type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting photo",
    });
  }
};

// delete product
const deleteProductController = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting product",
    });
  }
};

// update single product
const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields; // contains non-file fields
    const { photo } = req.files; // contains files
    switch (true) {
      case !name:
        return res.status(500).send({ mesage: "Name is required" });
      case !description:
        return res.status(500).send({ mesage: "Description is required" });
      case !category:
        return res.status(500).send({ mesage: "Category is required" });
      case !price:
        return res.status(500).send({ mesage: "Price is required" });
      case !quantity:
        return res.status(500).send({ mesage: "Quantity is required" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ mesage: "Photo is required and should be less than 1mb" });
    }
    const products = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};

// filter product
const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in filtering product",
      error,
    });
  }
};

// product count
const productCountcontroller = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in counting product",
      error,
    });
  }
};

// product per page
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * page)
      .limit(perPage)
      .sort({ createAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in counting page per page product",
      error,
    });
  }
};

// searh product
const searchProductcontroller = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(results);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in searching products",
      error,
    });
  }
};

// related product
const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in getting similar products",
      error,
    });
  }
};

// get product by category
const categoryProductController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in getting similar products",
      error,
    });
  }
};

// ====================payments getway===============
//braintree token
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payments
const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new Order({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProductController,
  productsController,
  singleProductController,
  photoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountcontroller,
  productListController,
  searchProductcontroller,
  relatedProductController,
  categoryProductController,
  braintreeTokenController,
  braintreePaymentController,
};
