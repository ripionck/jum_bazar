const express = require("express");
const {
  registerController,
  loginController,
  forgotPassController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} = require("../controllers/usersController");

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// register || method post
router.post("/register", registerController);

// login || post
router.post("/login", loginController);

// forgot password || post
router.post("/forgot-password", forgotPassController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// update user profile
router.put("/update-profile", requireSignIn, updateProfileController);

// orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

module.exports = router;
