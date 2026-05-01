const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");

// Protect routes - Verify JWT Token
const protect = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return ApiResponse.unauthorized("No token provided").send(res);
    }

    token = token.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userId = decoded.id || decoded.userId;
      
      if (!userId) {
        return ApiResponse.unauthorized("Invalid token payload").send(res);
      }

      // Get user from database
      const user = await User.findById(userId);
      
      if (!user || !user.isActive) {
        return ApiResponse.unauthorized("User not found or deactivated").send(res);
      }

      req.user = user;
      req.userId = userId;
      req.token = token;
      next();
    } catch (jwtError) {
      console.error("JWT Error:", jwtError);
      return ApiResponse.unauthorized("Invalid or expired token").send(res);
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return ApiResponse.unauthorized("Authentication failed").send(res);
  }
};

// Check role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized("Not authenticated").send(res);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        `Role '${req.user.role}' is not authorized to access this resource`
      ).send(res);
    }

    next();
  };
};

// Keep old auth function for backward compatibility
const auth = protect;

module.exports = { protect, authorize, auth };
