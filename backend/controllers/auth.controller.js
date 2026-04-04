const User = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/SendMail");
const crypto = require("crypto");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * @description  Register User
 * @route        POST /api/auth/register
 * @access       Public
 */
const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return ApiResponse.badRequest("Name, email, and password are required").send(res);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.conflict("Email already registered").send(res);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "student", // Default to student
      otp,
      otpExpire,
      isVerified: false,
    });

    await user.save();

    // Send OTP email
    const message = `
      <h2>Verify Your Email</h2>
      <p>Your OTP for registration is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `;
    await sendMail(email, "Registration OTP", message);

    // Send response (don't send password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return ApiResponse.success(
      { user: userResponse, requireOtp: true },
      "Registration successful. Please verify OTP sent to your email."
    ).send(res);
  } catch (error) {
    console.error("Register Error: ", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

/**
 * @description  Verify OTP for Registration
 * @route        POST /api/auth/verify-otp
 * @access       Public
 */
const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return ApiResponse.badRequest("Email and OTP are required").send(res);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.notFound("User not found").send(res);
    }

    if (user.isVerified) {
      return ApiResponse.badRequest("User is already verified").send(res);
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return ApiResponse.unauthorized("Invalid or expired OTP").send(res);
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = generateToken(user._id);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return ApiResponse.success({ user: userResponse, token }, "Verification successful").send(res);
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

/**
 * @description  Login User
 * @route        POST /api/auth/login
 * @access       Public
 */
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return ApiResponse.badRequest("Email and password are required").send(res);
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return ApiResponse.unauthorized("Invalid email or password").send(res);
    }

    // Check if user is active
    if (!user.isActive) {
      return ApiResponse.unauthorized("Your account has been deactivated").send(res);
    }

    // Check if verified
    if (!user.isVerified) {
      return ApiResponse.unauthorized("Please verify your email before logging in").send(res);
    }

    // Match password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return ApiResponse.unauthorized("Invalid email or password").send(res);
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return ApiResponse.success(
      { user: userResponse, token },
      "Login successful"
    ).send(res);
  } catch (error) {
    console.error("Login Error: ", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

/**
 * @description  Forgot Password
 * @route        POST /api/auth/forgot-password
 * @access       Public
 */
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return ApiResponse.badRequest("Please provide an email address").send(res);
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists for security
      return ApiResponse.success(
        null,
        "If email exists, reset link will be sent"
      ).send(res);
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset password URL
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${email}`;

    // Email message
    const message = `
      <h2>Password Reset Request</h2>
      <p>You have requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendMail(email, "Password Reset Request", message);
      return ApiResponse.success(null, "Reset link sent to email").send(res);
    } catch (emailError) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });

      return ApiResponse.internalServerError(
        "Email could not be sent"
      ).send(res);
    }
  } catch (error) {
    console.error("Forgot Password Error: ", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

/**
 * @description  Reset Password
 * @route        POST /api/auth/reset-password
 * @access       Public
 */
const resetPasswordController = async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !token || !password || !confirmPassword) {
      return ApiResponse.badRequest(
        "Email, token, password, and confirm password are required"
      ).send(res);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return ApiResponse.badRequest("Passwords do not match").send(res);
    }

    // Check password length
    if (password.length < 6) {
      return ApiResponse.badRequest(
        "Password must be at least 6 characters"
      ).send(res);
    }

    // Hash token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user
    const user = await User.findOne({
      email,
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return ApiResponse.unauthorized("Invalid or expired reset token").send(res);
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    // Generate new token
    const newToken = generateToken(user._id);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return ApiResponse.success(
      { user: userResponse, token: newToken },
      "Password reset successful"
    ).send(res);
  } catch (error) {
    console.error("Reset Password Error: ", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

/**
 * @description  Get Current User
 * @route        GET /api/auth/me
 * @access       Protected
 */
const getMeController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return ApiResponse.success(user, "User retrieved").send(res);
  } catch (error) {
    console.error("Get Me Error: ", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

module.exports = {
  registerController,
  verifyOtpController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getMeController,
};
