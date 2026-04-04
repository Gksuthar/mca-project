const express = require("express");
const router = express.Router();
const {
  registerController,
  verifyOtpController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getMeController,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public Routes
router.post("/register", registerController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// Protected Routes
router.get("/me", protect, getMeController);

module.exports = router;
