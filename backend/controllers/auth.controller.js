const User = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const crypto = require("crypto");
const sendEmail = require("../utils/SendMail");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json(
        ApiResponse.badRequest("Please provide all required fields")
      );
    }

    if (password !== confirmPassword) {
      return res.status(400).json(
        ApiResponse.badRequest("Passwords do not match")
      );
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json(
        ApiResponse.badRequest("User with this email already exists")
      );
    }

    // Validate role
    if (!["student", "faculty", "admin"].includes(role.toLowerCase())) {
      return res.status(400).json(
        ApiResponse.badRequest("Invalid role. Must be student, faculty, or admin")
      );
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role.toLowerCase(),
    });

    // Generate token
    const token = user.getSignedJwtToken();

    // Return response
    return res.status(201).json(
      ApiResponse.created({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }, "User registered successfully")
    );
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json(
      ApiResponse.internalServerError(error.message || "Registration failed")
    );
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json(
        ApiResponse.badRequest("Please provide email and password")
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json(
        ApiResponse.unauthorized("Invalid credentials")
      );
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json(
        ApiResponse.unauthorized("Invalid credentials")
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json(
        ApiResponse.forbidden("Your account has been deactivated")
      );
    }

    // Generate token
    const token = user.getSignedJwtToken();

    // Return response
    return res.status(200).json(
      ApiResponse.success({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }, "Login successful")
    );
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(
      ApiResponse.internalServerError(error.message || "Login failed")
    );
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(
        ApiResponse.badRequest("Please provide your email")
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(
        ApiResponse.notFound("User not found with this email")
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset password URL
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Please click on the link below to reset your password.</p>
      <p>This link is valid for only 30 minutes.</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Link",
        message,
      });

      return res.status(200).json(
        ApiResponse.success({ message: "Password reset link sent to your email" }, "Email sent successfully")
      );
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json(
        ApiResponse.internalServerError("Email could not be sent")
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json(
      ApiResponse.internalServerError("An error occurred")
    );
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json(
        ApiResponse.badRequest("Please provide token and passwords")
      );
    }

    if (password !== confirmPassword) {
      return res.status(400).json(
        ApiResponse.badRequest("Passwords do not match")
      );
    }

    // Hash token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json(
        ApiResponse.badRequest("Invalid or expired reset token")
      );
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new token
    const jwtToken = user.getSignedJwtToken();

    return res.status(200).json(
      ApiResponse.success({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }, "Password reset successfully")
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json(
      ApiResponse.internalServerError("An error occurred")
    );
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res.status(200).json(
      ApiResponse.success(user, "User retrieved successfully")
    );
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json(
      ApiResponse.internalServerError("An error occurred")
    );
  }
};

// Logout (optional - mainly for frontend token removal)
exports.logout = async (req, res) => {
  try {
    return res.status(200).json(
      ApiResponse.success({}, "Logout successful")
    );
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json(
      ApiResponse.internalServerError("An error occurred")
    );
  }
};
