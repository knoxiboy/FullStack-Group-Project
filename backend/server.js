// server.js - Main entry point for the backend application
// This file sets up the Express server, applies middleware,
// connects to the database, and starts listening for requests.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from the .env file
// This must be called before we use any process.env values
dotenv.config();

// Connect to MongoDB
connectDB();

// Create the Express application
const app = express();

// --- Middleware ---

// Enable CORS so the frontend (running on a different port) can talk to us
app.use(cors());

// Parse incoming JSON request bodies (for POST/PUT requests)
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// --- Routes ---

// A simple health check route to verify the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// We will add more route files here as we build them:
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const matchRoutes = require("./routes/matchRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Mount the auth routes on /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/candidate", candidateRoutes);

// --- Start the server ---

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
