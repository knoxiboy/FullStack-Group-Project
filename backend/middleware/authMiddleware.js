// authMiddleware.js - JWT authentication middleware
// This middleware runs before any protected route handler.
// It checks if the request has a valid JWT token in the Authorization header.
// If the token is valid, it attaches the user's ID to req.user so the
// controller can identify who is making the request.

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // Get the Authorization header from the request
  // Expected format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  // Extract the token part (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    // If the token is valid, jwt.verify returns the decoded payload
    // which contains the user ID we stored during login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database to get their role and other details
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Attach the user document to the request object
    // Now any controller after this middleware can access req.user.id and req.user.role
    req.user = user;

    // Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is expired or invalid, jwt.verify throws an error
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
