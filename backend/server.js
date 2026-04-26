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

// Root route to show the API is alive
app.get("/", (req, res) => {
  res.send("<h1>MaesterMatch API</h1><p>The backend server is running successfully. Access the API at /api/health</p>");
});

// Route mounting
app.use("/api/auth", require("./routes/shared/authRoutes"));
app.use("/api/resumes", require("./routes/recruiter/resumeRoutes"));
app.use("/api/jobs", require("./routes/recruiter/jobRoutes"));
app.use("/api/matches", require("./routes/recruiter/matchRoutes"));
app.use("/api/candidate", require("./routes/candidate/candidateRoutes"));

// Catch-all route for undefined routes (404)
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found on this server.` });
});

// --- Start the server ---

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
