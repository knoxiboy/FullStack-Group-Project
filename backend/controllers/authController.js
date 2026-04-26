// authController.js - Handles user registration and login
// This controller contains the business logic for authentication.
// It uses bcryptjs to hash passwords and jsonwebtoken to create tokens.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- SIGNUP ---
// Creates a new user account
// Route: POST /api/auth/signup
const signup = async (req, res) => {
  try {
    // Get the data from the request body
    const { username, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving
    // The number 10 is the salt rounds - higher means more secure but slower
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user document
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: role || "candidate",
    });

    // Save to the database
    await newUser.save();

    // Generate a JWT token for the newly registered user
    // This way they are logged in immediately after signup
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Send back the user data and token
    // We do not send the password back to the client
    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// --- LOGIN ---
// Authenticates a user and returns a JWT token
// Route: POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hash
    // bcrypt.compare hashes the input and checks it against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Send back the token and user data
    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- GET PROFILE ---
// Returns the logged-in user's profile data
// Route: GET /api/auth/profile
// This route requires authentication (JWT token in the header)
const getProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware (we will create it next)
    // We use .select("-password") to exclude the password from the result
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: user });
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

module.exports = { signup, login, getProfile };
