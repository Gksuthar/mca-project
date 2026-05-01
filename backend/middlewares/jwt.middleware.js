const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json(
      ApiResponse.unauthorized("Not authorized to access this route")
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(
      ApiResponse.unauthorized("Not authorized to access this route")
    );
  }
};

// Verify role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.forbidden(`User role '${req.user.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};
