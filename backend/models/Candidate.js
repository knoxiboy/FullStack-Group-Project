// Candidate.js - Mongoose schema and model for parsed candidate data
// Each document in this collection represents one candidate whose resume
// has been uploaded and parsed by our system.

const mongoose = require("mongoose");

// Sub-schema for education entries
// Each candidate can have multiple education entries (e.g., B.Tech and M.Tech)
const educationSchema = new mongoose.Schema({
  degree: { type: String, default: "" },
  institution: { type: String, default: "" },
  year: { type: String, default: "" },
}, { _id: false }); // _id: false means subdocuments do not get their own _id

// Sub-schema for work experience entries
const experienceSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  company: { type: String, default: "" },
  duration: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

// Main candidate schema
const candidateSchema = new mongoose.Schema({
  // Candidate's full name (extracted from resume)
  name: {
    type: String,
    default: "Unknown",
  },

  // Candidate's email address (extracted from resume)
  email: {
    type: String,
    default: "",
  },

  // Candidate's phone number (extracted from resume)
  phone: {
    type: String,
    default: "",
  },

  // Array of skill strings found in the resume
  // Example: ["javascript", "react", "node.js", "mongodb"]
  skills: {
    type: [String],
    default: [],
  },

  // Array of education entries
  education: {
    type: [educationSchema],
    default: [],
  },

  // Array of work experience entries
  experience: {
    type: [experienceSchema],
    default: [],
  },

  // Path to the uploaded resume file on the server
  resumeFile: {
    type: String,
    required: true,
  },

  // The full extracted text from the resume
  // Stored so we can re-parse or search through it later
  rawText: {
    type: String,
    default: "",
  },

  // Reference to the recruiter who uploaded this resume
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
