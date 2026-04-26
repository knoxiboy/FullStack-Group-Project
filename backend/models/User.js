// User.js - Mongoose schema and model for the Users collection
// This model defines the structure of a user document in MongoDB.
// Users are recruiters or admins who can log in and use the system.

const mongoose = require("mongoose");

// Define the schema - this tells MongoDB what fields each user document has
const userSchema = new mongoose.Schema({
  // The recruiter's display name
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },

  // Email is used for login, so it must be unique
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  // Password will be stored as a bcrypt hash, never as plain text
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  // Role determines what the user can do in the system
  // "recruiter" for employers, "candidate" for job seekers
  role: {
    type: String,
    enum: ["recruiter", "candidate", "admin"],
    default: "candidate",
  },

  // Mongoose automatically manages createdAt and updatedAt fields
  // when we pass the timestamps option below
}, { timestamps: true });

// Create the model from the schema
// "User" is the model name, Mongoose will create a "users" collection
const User = mongoose.model("User", userSchema);

module.exports = User;
